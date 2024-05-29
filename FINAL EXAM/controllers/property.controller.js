import Property from "../models/property.model.js";

export const getProperties = async (req, res, next) => {
  try {
    console.log(req.query);
    const limit = parseInt(req.query.limit) || 8;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || "";
    
    const amenities = req.query.amenities || [];
    const offer = amenities.includes('offer');
    const furnished = amenities.includes('furnished');
    const parking = amenities.includes('parking');

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    let sort = "createdAt";
    let order = "desc";
    if (req.query.sort_order) {
      const [sortField, sortOrder] = req.query.sort_order.split('_');
      sort = sortField;
      order = sortOrder === 'asc' ? 'asc' : 'desc';
    }

    const query = {
      name: { $regex: searchTerm, $options: "i" },
      type,
    };

    if (offer) {
      query.offer = true;
    }

    if (furnished) {
      query.furnished = true;
    }

    if (parking) {
      query.parking = true;
    }

    const properties = await Property.find(query)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.render("search", { properties });
  } catch (error) {
    next(error);
  }
};


export const findProperties = async (type, offer) => {
  try {
    if (offer == null) {
      offer = { $in: [false, true] };
    }

    if (type == null || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    const properties = await Property.find({ type, offer }).limit(10);
    return properties;
  } catch (error) {
    console.log(error);
  }
};

export const renderProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate("userRef");
    console.log(property);
    if (!property) {
      return res.status(400).json("Property not found!");
    }

    if (!req.session.visitedProperties) {
      req.session.visitedProperties = [];
    }

    if (!req.session.visitedProperties.includes(property._id.toString())) {
      req.session.visitedProperties.push(property._id.toString());
    }

    const similarProperties = await Property.find({
      type: property.type,
      _id: { $ne: property._id },
    }).limit(8);
    res.render("property/property", { property, similarProperties });
  } catch (error) {
    next(error);
  }
};

export const renderVisitedProperties = async (req, res, next) => {
  try {
    if (
      !req.session.visitedProperties ||
      req.session.visitedProperties.length === 0
    ) {
      return res.status(200).json("No visited properties found.");
    }

    const visitedProperties = await Property.find({
      _id: { $in: req.session.visitedProperties },
    });

    res.render("property/visitedProperty", { properties: visitedProperties });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  console.log(property);

  if (!property) {
    return res.status(400).json("Property not found!");
  }

  if (req.user.id != property.userRef) {
    console.log(req.user.id);
    return res.status(403).json("You can delete only your property!");
  }

  try {
    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json("Property has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const renderCreateProperty = (req, res) => {
  return res.render("property/createProperty", {});
};

export const renderUpdateProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(400).json("Property not found!");
  }
  if (req.user.id != property.userRef) {
    return res.status(403).json("You can update only your property!");
  }
  return res.render("property/updateProperty", { property });
};

export const createProperty = async (req, res, next) => {
  try {
    console.log(req.body);
    const property = await Property.create({
      ...req.body,
      userRef: req.user.id,
    });
    property.save();
    console.log(property);
    return res.status(201).json(property);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateProperty = async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(400).json("Property not found!");
  }
  if (req.user.id != property.userRef) {
    return res.status(403).json("You can update only your property!");
  }

  console.log(req.body);
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProperty);
  } catch (error) {
    next(error);
  }
};
