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

$(document).ready(function () {
    $("#input-submit").on("click",submitHandler);
});
