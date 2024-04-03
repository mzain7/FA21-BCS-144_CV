const images = document.querySelectorAll("img");
let ul = document.querySelector('#menu');



// document.onload = function () {
    images.forEach((img) => {
        console.log(img);
        img.addEventListener('mouseenter', function () {
            let li = document.createElement('li');
            let a = document.createElement('a');
            a.href = img.src;
            a.textContent = img.title;
            li.appendChild(a);

            ul.appendChild(li);
        });
    });
// };