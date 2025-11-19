document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("header-placeholder");

  if (placeholder) {
    fetch("header.html")
      .then(res => res.text())
      .then(data => {
        placeholder.innerHTML = data;
      });
  }
});
