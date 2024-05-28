import Property from "../models/property.model.js";

export const getProperties = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const properties = await Property.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.render("search", { properties, user: req.user });
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

    const similarProperties = await Property.find({
      type: property.type,
      _id: { $ne: property._id },
    }).limit(8);
    res.render("property/property", { property, similarProperties, user: req.user });
  } catch (error) {
    next(error);
  }
};


export const deleteProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(400).json("Property not found!");
  }

  if (req.user.id !== property.userRef) {
    return res.status(403).json("You can delete only your property!");
  }

  try {
    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json("Property has been deleted!");
  } catch (error) {
    next(error);
  }
};