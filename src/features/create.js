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

export const createURL = (start = 1, option = "%20", keywords = "%20") => {
  const apiKey = import.meta.env.VITE_API_KEY;

  let selectedCategory = document.querySelector(".selected").textContent;
  selectedCategory =
    selectedCategory === "전체" ? "%20" : selectedCategory.split("/")[0];

  if (option === "service-name")
    return `http://openapi.seoul.go.kr:8088/${apiKey}/json/ListPublicReservationEducation/${start}/${
      start + 9
    }/${selectedCategory}/${keywords}`;
  else if (option === "service-person")
    return `http://openapi.seoul.go.kr:8088/${apiKey}/json/ListPublicReservationEducation/${start}/${
      start + 9
    }/${selectedCategory}/%20/${keywords}`;
  else if (option === "region")
    return `http://openapi.seoul.go.kr:8088/${apiKey}/json/ListPublicReservationEducation/${start}/${
      start + 9
    }/${selectedCategory}/%20/%20/${keywords}`;
  else
    return `http://openapi.seoul.go.kr:8088/${apiKey}/json/ListPublicReservationEducation/${start}/${
      start + 9
    }/${selectedCategory}`;
};
