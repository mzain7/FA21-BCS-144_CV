$(document).ready(function () {
  $("#signInForm").on("submit", function (event) {
    event.preventDefault();

    $.ajax({
      type: "POST",
      url: "/api/auth/login",
      data: {
        email: email,
        password: password,
      },
      success: function (response) {
        alert("Form submitted successfully!");
      },
      error: function (xhr, status, error) {
        $("#signInError").text(xhr.responseJSON.message);
      },
    });
  });
});
