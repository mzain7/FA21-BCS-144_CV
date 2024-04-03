const images = document.querySelectorAll("img");
let ul = document.querySelector('#menu ul');





document.onload = function () {
    images.forEach((img) => {
        console.log(img);
        img.addEventListener('mouseenter', function () {
            let li = document.createElement('li');

            li.textContent = img.title;

            ul.prepend(li);
        });
    });
};



// images.forEach((image) => {
//     image.addEventListener("mouseenter", (e) => {
//         document.getElementById(
//             "altText"
//         ).innerHTML = Image Alt Text: ${ e.target.alt };
//     });
//     image.addEventListener("mouseleave", (e) => {
//         document.getElementById(
//             "altText"
//         ).innerHTML = Image Alt Text: Nothing;
//     });
// });