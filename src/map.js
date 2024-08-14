export const renderingMap = (element, places, type) => {
  let mapOption = {
    center: new kakao.maps.LatLng(37.5665, 126.978),
    level: 8,
  };

  let map = new kakao.maps.Map(element, mapOption);
  createMarker(places, map, type);
};

const createMarker = (places, map, type) => {
  let imageSrc = "../img/marker.svg";

  for (let i = 0; i < places.length; i++) {
    let imageSize = new kakao.maps.Size(40, 40);
    let imageOffset = new kakao.maps.Point(20, 40);
    let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, {
      offset: imageOffset,
    });

    let marker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(places[i].Y, places[i].X),
      title: places[i].PLACENM,
      image: markerImage,
    });

    if (type === "detail") {
      let content = `
        <div class="overlay">
            <img src="${places[i].IMGURL}" alt="thumbnail" />
            <div>
                <p class="service-name">${places[i].SVCNM}</p>
                <span class="place-name">${places[i].PLACENM}</span>
            </div>
        </div>
    `;

      let customOverlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(places[i].Y, places[i].X),
        content: content,
        yAnchor: 1,
      });

      let isVisible = false;

      kakao.maps.event.addListener(marker, "click", () => {
        if (!isVisible) customOverlay.setMap(map);
        else customOverlay.setMap(null);
      });
    }
  }
};
