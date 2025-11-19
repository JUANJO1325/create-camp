const comunaItems = document.querySelectorAll(".comuna");
const paths = document.querySelectorAll(".commune-shape");
const tooltip = document.getElementById("tooltip");
const svg = document.querySelector("svg");

const targetMap = {};
comunaItems.forEach((item) => {
  targetMap[item.dataset.target] = item;
});

function clearActive() {
  paths.forEach((p) => p.classList.remove("active"));
  comunaItems.forEach((i) => i.classList.remove("inactive"));
}

comunaItems.forEach((item) => {
  item.addEventListener("click", () => {
    const targetId = item.dataset.target;
    const path = document.getElementById(targetId);
    if (!path) return;

    clearActive();
    path.classList.add("active");
    comunaItems.forEach((i) => i.classList.add("inactive"));
    item.classList.remove("inactive");

    const bb = path.getBBox();
    const cx = bb.x + bb.width / 2;
    const cy = bb.y + bb.height / 2;

    const pt = svg.createSVGPoint();
    pt.x = cx;
    pt.y = cy;
    const ctm = svg.getScreenCTM();
    const screenPt = pt.matrixTransform(ctm);

    tooltip.style.left = screenPt.x + "px";
    tooltip.style.top = screenPt.y + "px";
    tooltip.textContent = item.textContent.trim();
    tooltip.style.display = "block";

    clearTimeout(window._tippyHide);
    window._tippyHide = setTimeout(() => (tooltip.style.display = "none"), 2600);
  });
});

paths.forEach((path) => {
  path.addEventListener("click", () => {
    const id = path.id;
    const listItem = targetMap[id];
    if (listItem) {
      listItem.click();
      listItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  path.addEventListener("mouseenter", () => {
    const title = path.id.replace("comuna-", "").replace("-", " ");
    const bb = path.getBBox();
    const pt = svg.createSVGPoint();
    pt.x = bb.x + bb.width / 2;
    pt.y = bb.y + bb.height / 2;
    const screenPt = pt.matrixTransform(svg.getScreenCTM());
    tooltip.style.left = screenPt.x + "px";
    tooltip.style.top = screenPt.y + "px";
    tooltip.textContent = title;
    tooltip.style.display = "block";
  });

  path.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });
});
