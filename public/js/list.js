const list = document.querySelectorAll(".cList > li");
const title = document.querySelectorAll("a > p:nth-of-type(2)");

const $data = document.querySelector(".search input");
const $btn = document.querySelector(".search button");

$btn.addEventListener("click", () => {
  let dt = $data.value;
  let inner = "";
  list.forEach((a) => {
    a.classList.remove("on");
  });
  title.forEach((a, i) => {
    inner = a.innerText;
    console.log(`${dt} 데이타`);
    if (inner.includes(dt)) {
      a.parentElement.parentElement.classList.add("on");
    }
  });
});

const moreButton = document.querySelector(".more-button button");
const slides = document.querySelectorAll(".swiper-slide");

moreButton.addEventListener("click", () => {
  slides.forEach((slide) => {
    slide.classList.toggle("show");
  });
});
