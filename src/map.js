export const renderingMap = (element, places) => {
  let mapOption = {
    center: new kakao.maps.LatLng(37.5665, 126.978),
    level: 8,
  };

  let map = new kakao.maps.Map(element, mapOption);
  createMarker(places, map, "main");
};

export const renderingDetailMap = (element, place) => {
  let mapOption = {
    center: new kakao.maps.LatLng(place[0].Y, place[0].X),
    level: 3,
  };

  let map = new kakao.maps.Map(element, mapOption);
  createMarker(place, map, "detail");
};

const createMarker = (places, map, type) => {
  let imageSrc = "../img/marker.svg";

  places.map((place) => {
    let imageSize = new kakao.maps.Size(40, 40);
    let imageOffset = new kakao.maps.Point(20, 40);
    let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, {
      offset: imageOffset,
    });

    let marker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(place.Y, place.X),
      title: place.PLACENM,
      image: markerImage,
    });

    if (type === "detail") {
      let content = `
        <div class="overlay">
            <img src="${place.IMGURL}" alt="thumbnail" />
            <div>
                <p class="service-name">${place.SVCNM}</p>
                <span class="place-name">${place.PLACENM}</span>
            </div>
        </div>
    `;

      let customOverlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(place.Y, place.X),
        content: content,
        yAnchor: 1,
      });
      customOverlay.setMap(map);
    }
  });
};
