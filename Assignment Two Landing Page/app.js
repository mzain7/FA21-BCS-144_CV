function validateForm() {
    var name = document.getElementById("input-name");
    var email = document.getElementById("input-email");
    var subject = document.getElementById("input-subject");
    var message = document.getElementById("input-message");
    var emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    validate = true;
    name.classList.remove("contact-input-error");
    email.classList.remove("contact-input-error");
    subject.classList.remove("contact-input-error");
    message.classList.remove("contact-input-error");

    if (name.value.trim() === '' || name.value.length < 2 || name.value.length > 50) { 
        name.classList.add("contact-input-error");
        validate = false;
    }

    if (!emailPattern.test(email)) {
        email.classList.add("contact-input-error");
        validate = false;
    }

    if (subject.value.trim() === '' || subject.value === null || subject.value.length < 2 || subject.value.length > 50) {
        subject.classList.add("contact-input-error");
        validate = false;
    }

    if (message.value.trim() === '' || message.value === null || message.value.length < 2 || message.value.length > 50) {
        message.classList.add("contact-input-error");
        validate = false;
    }

    return validate;
}

function handleSubmit(event) {
    event.preventDefault();
    if (validateForm()) {
        alert("Form submitted");
    }
}

var submitBtn = document.getElementById("input-submit");
submitBtn.onclick = handleSubmit;
