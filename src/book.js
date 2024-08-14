// 모바일 환경 카테고리 토글

document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".mobile-cate").classList.toggle("active");
});

document.querySelector(".mobile-cate .fa-x").addEventListener("click", () => {
  document.querySelector(".mobile-cate").classList.toggle("active");
});
