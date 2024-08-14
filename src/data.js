let start = 1;

let url = `http://openapi.seoul.go.kr:8088/735a4d656177686734374978656774/json/ListPublicReservationEducation/${start}/${
  start + 9
}/`;
let totalLength;

const createItem = (event) => {
  return `
    <div class="list">
        <div class="status blue">${event.SVCSTATNM}</div>
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
            <img src="../img/user.svg" alt="user-icon" />
            <p class="years">${event.USETGTINFO}</p>
            </li>
            <li class="item">
            <img src="../img/pin.svg" alt="pin-icon" /><span
                class="period"
                >${event.SVCOPNBGNDT.split(" ")[0]} ~ ${
    event.SVCOPNENDDT.split(" ")[0]
  }</span>
            </li>
            <li class="item">
            <img src="../img/calendar.svg" alt="calendar-icon" /><span
                class="place"
                >${event.PLACENM}</span
            >
            </li>
        </div>
        </ul>
    </div>
    `;
};

const fetchData = async () => {
  return await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data = data.ListPublicReservationEducation;
      totalLength = data.list_total_count;

      return data.row;
    });
};

const renderItem = async () => {
  const $listWrapper = document.querySelector(".list-wrapper");
  const data = await fetchData();

  const itemHtml = data.map((row) => createItem(row)).join("");
  $listWrapper.innerHTML = itemHtml;
};

renderItem();
