const $map = document.querySelector(".map");

document.querySelectorAll(".list").forEach((list) => {
  list.addEventListener("click", () => {
    document.querySelector(".mobile-detail-con").classList.toggle("active");

    $map.style.height = "calc(100% - 30rem)";
    document.querySelector(".details").style.display = "flex";
  });
});

document
  .querySelector(".mobile-detail-con .fa-x")
  .addEventListener("click", () => {
    document.querySelector(".mobile-detail-con").classList.toggle("active");
  });

var mapOption = {
  center: new kakao.maps.LatLng(37.5665, 126.978),
  level: 8,
};

var map = new kakao.maps.Map($map, mapOption);

var markerPosition = new kakao.maps.LatLng(37.5665, 126.978);

var marker = new kakao.maps.Marker({
  position: markerPosition,
});

marker.setMap(map);
