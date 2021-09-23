function collapse(event) {
  if (event.target.localName == "legend") {
    content = event.target.nextElementSibling;
    event.target.classList.toggle("active");
  } else {
    content = event.target.parentNode.nextElementSibling;
    event.target.parentNode.classList.toggle("active");
  }

  if (content.style.maxHeight) {
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = "unset";
  }
}
