function validateForm() {
    var name = $("#input-name");
    var email = $("#input-email");
    var subject = $("#input-subject");
    var message = $("#input-message");
    var emailPattern =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    var validate = true;
    $(".contact-input").removeClass("contact-input-error");

    if (
        name.val().trim() === "" ||
        name.val().length < 2 ||
        name.val().length > 50
    ) {
        name.addClass("contact-input-error");
        validate = false;
    }

    if (!emailPattern.test(email.val())) {
        email.addClass("contact-input-error");
        validate = false;
    }

    if (
        subject.val().trim() === "" ||
        subject.val() === null ||
        subject.val().length < 2 ||
        subject.val().length > 50
    ) {
        subject.addClass("contact-input-error");
        validate = false;
    }

    if (
        message.val().trim() === "" ||
        message.val() === null ||
        message.val().length < 2 ||
        message.val().length > 50
    ) {
        message.addClass("contact-input-error");
        validate = false;
    }

    return validate;
}

function submitHandler(event) {
    event.preventDefault();
    if (validateForm()) {
        alert("Form submitted");
    }
}


function fetchData() {
    $.ajax({
        url: 'https://usmanlive.com/wp-json/api/stories',
        dataType: 'json',
        success: function (stories) {
            displayData(stories);
        },
        error: function (error) {
            console.error('Error', error);
        }
    });
}

function displayData(stories) {
    const listingContainer = $('#listingContainer');
    listingContainer.empty();

    $.each(stories, function (index, story) {
        const card = $('<div class="card mb-3"></div>');
        const cardBody = $('<div class="card-body"></div>');

        cardBody.append('<h5 class="card-title">' + story.title + '</h5>');
        cardBody.append('<p class="card-text">Content: ' + story.content + '</p>');

        const deleteBtn = $('<button class="btn btn-danger">Delete</button>');
        deleteBtn.click(function () {
            deleteData(story.id);
        });

        cardBody.append(deleteBtn);
        card.append(cardBody);
        listingContainer.append(card);
    });
}



function addData(data) {
    $.ajax({
        url: 'https://usmanlive.com/wp-json/api/stories',
        type: 'POST',
        data: data,
        success: function () {
            fetchData();
            $('#addStoryForm')[0].reset();
        },
        error: function (error) {
            console.error('Error adding story:', error);
        }
    });
}

function deleteData(id) {
    $.ajax({
        url: 'https://usmanlive.com/wp-json/api/stories/' + id,
        type: 'DELETE',
        success: function () {
            fetchData(); 
        },
        error: function (error) {
            console.error('Error deleting story:', error);
        }
    });
}

fetchData();
$(document).ready(function () {
    $("#input-submit").on("click",submitHandler);

    $('#addStoryForm').submit(function (event) {
        event.preventDefault();
        addData($(this).serialize());
    });
});

