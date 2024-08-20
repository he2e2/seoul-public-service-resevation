const seoul = {
  X: 126.978,
  Y: 37.5665,
};

export const renderingMap = (
  element,
  data,
  x = seoul.X,
  y = seoul.Y,
  type = "main"
) => {
  const mapOption = {
    center: new kakao.maps.LatLng(y, x),
    level: type === "main" ? 8 : 3,
  };

  const map = new kakao.maps.Map(element, mapOption);

  if (type === "main") {
    const clusterer = createClusterer(map);
    addMarkersToMap(data, map, clusterer);
    return;
  }

  addMarkersToMap(data, map, null, "detail");
};

const createClusterer = (map) => {
  const clusterer = new kakao.maps.MarkerClusterer({
    map: map,
    averageCenter: true,
    minLevel: 6,
    disableClickZoom: true,
    styles: [
      {
        width: "50px",
        height: "50px",
        background: "rgba(94, 129, 244, 0.7)",
        borderRadius: "25px",
        boxShadow: "0 0 10px 5px rgba(94, 129, 244, 0.8)",
        color: "#323232",
        textAlign: "center",
        lineHeight: "50px",
        fontSize: "1rem",
        fontWeight: "bold",
      },
    ],
  });

  kakao.maps.event.addListener(clusterer, "clusterclick", (cluster) => {
    const level = map.getLevel() - 1;
    map.setLevel(level, { anchor: cluster.getCenter() });
  });

  return clusterer;
};

const addMarkersToMap = (places, map, clusterer, type = "main") => {
  const markers = places.map((place) => createMarker(map, place, type));

  if (clusterer) {
    clusterer.addMarkers(markers);
    return;
  }
  markers.forEach((marker) => marker.setMap(map));
};

const createMarker = (map, place, type) => {
  const markerImage = createMarkerImage();
  const marker = new kakao.maps.Marker({
    map: map,
    position: new kakao.maps.LatLng(place.Y, place.X),
    title: place.PLACENM,
    image: markerImage,
  });

  if (type === "detail") addDetailOverlay(marker, place);

  return marker;
};

const createMarkerImage = () => {
  const imageSrc = "src/assets/img/marker.svg";
  const imageSize = new kakao.maps.Size(40, 40);
  const imageOffset = new kakao.maps.Point(20, 40);

  return new kakao.maps.MarkerImage(imageSrc, imageSize, {
    offset: imageOffset,
  });
};

const addDetailOverlay = (marker, place) => {
  const mapLink = `https://map.kakao.com/link/map/${place.Y},${place.X}`;
  const content = createOverlayContent(place, mapLink);

  const customOverlay = new kakao.maps.CustomOverlay({
    position: new kakao.maps.LatLng(place.Y, place.X),
    content: content,
    yAnchor: 1,
    zIndex: 3,
  });

  customOverlay.setMap(marker.getMap());
  addOverlayCloseEvent(customOverlay);
};

const createOverlayContent = (place, mapLink) => {
  return `
    <div class="overlay">
      <i class="fa-solid fa-x close-overlay"></i>
      <a href="${mapLink}" target="_blank">
        <img src="${place.IMGURL}" alt="thumbnail" />
        <div>
          <p class="service-name">${place.SVCNM}</p>
          <span class="place-name">${place.PLACENM}</span>
        </div>
      </a>
    </div>
  `;
};

const addOverlayCloseEvent = (customOverlay) => {
  setTimeout(() => {
    const closeButton = document.querySelector(".close-overlay");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        customOverlay.setMap(null);
      });
    }
  }, 0);
};
