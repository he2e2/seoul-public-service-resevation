export const renderingMap = (element, places) => {
  const mapOption = {
    center: new kakao.maps.LatLng(37.5665, 126.978),
    level: 8,
  };

  const map = new kakao.maps.Map(element, mapOption);
  const clusterer = createClusterer(map);

  createMarker(places, map, clusterer, "main");
};

export const renderingDetailMap = (element, place) => {
  const mapOption = {
    center: new kakao.maps.LatLng(place[0].Y, place[0].X),
    level: 3,
  };

  const map = new kakao.maps.Map(element, mapOption);
  createMarker(place, map, null, "detail");
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

const createMarker = (places, map, clusterer, type) => {
  const imageSrc = "src/assets/img/marker.svg";

  const markers = places.map((place) => {
    const imageSize = new kakao.maps.Size(40, 40);
    const imageOffset = new kakao.maps.Point(20, 40);
    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, {
      offset: imageOffset,
    });

    const marker = new kakao.maps.Marker({
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
        zIndex: 3,
      });
      customOverlay.setMap(map);
    }

    return marker;
  });

  if (clusterer) {
    clusterer.addMarkers(markers);
    return;
  }
  markers.forEach((marker) => marker.setMap(map));
};
