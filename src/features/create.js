const statusClassNames = {
  접수중: "blue",
  안내중: "blue",
  예약일시중지: "red",
  접수종료: "gray",
  예약마감: "gray",
};

const formatDateRange = (start, end) => {
  return `${start.split(" ")[0]} ~ ${end.split(" ")[0]}`;
};

export const createItem = (event) => {
  const statusClassName = statusClassNames[event.SVCSTATNM] || "";

  return `
      <div class="list">
          <div class="status ${statusClassName}">${
    event.SVCSTATNM === "예약일시중지" ? "일시중지" : event.SVCSTATNM
  }</div>
          <img
          class="thumbnail"
          src=${event.IMGURL}
          alt="thumbnail"
          />
          <ul class="description">
          <h3 class="title">
              ${event.SVCNM}
          </h3>
          <div>
              <li class="item">
              <img src="src/assets/img/user.svg" alt="user-icon" />
              <p class="years">${event.USETGTINFO}</p>
              </li>
              <li class="item">
              <img src="src/assets/img/pin.svg" alt="pin-icon" /><span
                  class="period"
                  >${formatDateRange(
                    event.SVCOPNBGNDT,
                    event.SVCOPNENDDT
                  )}</span>
              </li>
              <li class="item">
              <img src="src/assets/img/calendar.svg" alt="calendar-icon" /><span
                  class="place"
                  >${event.PLACENM}</span
              >
              </li>
          </div>
          </ul>
      </div>
      `;
};

export const getSelectedCategory = () => {
  let selectedCategory = document.querySelector(".selected").textContent;
  return selectedCategory === "전체" ? "%20" : selectedCategory.split("/")[0];
};

export const getAdditionalURL = () => {
  const selectedOption = document.getElementById("search-type").value;
  const inputValue = document.getElementById("search").value;

  const urls = {
    "service-name": `${inputValue}/`,
    "service-person": `%20/${inputValue}/`,
    "region": `%20/%20/${inputValue}/`,
    "default": "",
  };

  return urls[selectedOption] || urls["default"];
};

export const createURL = (start = 1, option = "%20", keywords = "%20") => {
  const apiKey = import.meta.env.VITE_API_KEY;

  const selectedCategory = getSelectedCategory();

  const urls = {
    "service-name": `${selectedCategory}/${keywords}`,
    "service-person": `${selectedCategory}/%20/${keywords}`,
    "region": `${selectedCategory}/%20/%20/${keywords}`,
    "default": selectedCategory,
  };

  const urlPath = urls[option] || urls["default"];

  return `http://openapi.seoul.go.kr:8088/${apiKey}/json/ListPublicReservationEducation/${start}/${
    start + 9
  }/${urlPath}`;
};
