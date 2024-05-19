$(document).ready(function () {
  $("#signInForm").on("submit", function (event) {
    event.preventDefault();

    $("#signInError").text("");

    $("#signInButton").attr("disabled", true);

    const email = $("#email").val().trim();
    const password = $("#password").val().trim();

    $.ajax({
      type: "POST",
      url: "/user/sign-in",
      data: {
        email: email,
        password: password,
      },
      success: function (response) {
        alert("Form submitted successfully!");
      },
      error: function (xhr, status, error) {
        $("#signInError").text(xhr.responseJSON);
        $("#signInButton").attr("disabled", false);
      },
    });
  });
});
