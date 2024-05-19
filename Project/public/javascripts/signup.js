$(document).ready(function () {
  $("#signupForm").on("submit", function (event) {
    event.preventDefault();

    $("#signupError").text("");

    $("#signupButton").attr("disabled", true);

    const username = $("#username").val().trim();
    const email = $("#email").val().trim();
    const password = $("#password").val().trim();

    $.ajax({
      type: "POST",
      url: "/user/sign-up",
      data: {
        username: username,
        email: email,
        password: password,
      },
      success: function (response) {
        alert("Form submitted successfully!");
      },
      error: function (xhr, status, error) {
        console.log(xhr, status, error);
        $("#signupError").text(xhr.responseJSON.message);
        $("signupButton").attr("disabled", false);
      },
    });
  });
});
