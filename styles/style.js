let coll = document.getElementsByClassName("collapsible");

let i;
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", collapse, true);
}

function collapse(event) {
  if (event.target.localName == "button") {
    content = event.target.nextElementSibling.nextElementSibling;
    event.target.classList.toggle("active");
  } else {
    content = event.target.nextElementSibling;
    event.target.previousElementSibling.classList.toggle("active");
  }

  if (content.style.maxHeight) {
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = `${content.scrollHeight}px`;
  }
}

i = 0;
let span1 = "Enterprise Content Management";
let span2 = "© OPTIMAL SYSTEMS - all rights reserved";
let speed = 60; /* The speed/duration of the effect in milliseconds */

(function typeWriter() {
  if (i < span1.length + span1.length) {
    document.querySelector(".header-banner__text--ecm").innerHTML +=
      span1.charAt(i);
    document.querySelector(".header-banner__text--OS").innerHTML +=
      span2.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
})();
