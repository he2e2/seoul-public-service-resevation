export const renderingMap = (element, places) => {
  const mapOption = {
    center: new kakao.maps.LatLng(37.5665, 126.978),
    level: 8,
  };

  const map = new kakao.maps.Map(element, mapOption);
  createMarker(places, map, "main");
};

export const renderingDetailMap = (element, place) => {
  const mapOption = {
    center: new kakao.maps.LatLng(place[0].Y, place[0].X),
    level: 3,
  };

  const map = new kakao.maps.Map(element, mapOption);
  createMarker(place, map, "detail");
};

const createMarker = (places, map, type) => {
  const imageSrc = "src/assets/img/marker.svg";

  places.map((place) => {
    const imageSize = new kakao.maps.Size(40, 40);
    const imageOffset = new kakao.maps.Point(20, 40);
    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, {
      offset: imageOffset,
    });

    const marker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(place.Y, place.X),
      title: place.PLACENM,
      image: markerImage,
    });

    if (type === "detail") {
      const mapLink = `https://map.kakao.com/link/map/${place.Y},${place.X}`;
      const content = `
        <div class="overlay">
          <a href="${mapLink}" target="_blank">
            <img src="${place.IMGURL}" alt="thumbnail" />
            <div>
                <p class="service-name">${place.SVCNM}</p>
                <span class="place-name">${place.PLACENM}</span>
            </div>
          </a>
        </div>
    `;

      const customOverlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(place.Y, place.X),
        content: content,
        yAnchor: 1,
      });
      customOverlay.setMap(map);
    }
  });
};
