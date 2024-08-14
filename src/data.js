let totalItems;
const postsPerPage = 10;
const pagesPerGroup = 5;

let currentPage = 1;
let currentGroup = 1;
let totalPages = Math.ceil(totalItems / postsPerPage);

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

const fetchData = async (url) => {
  return await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data = data.ListPublicReservationEducation;
      totalItems = data.list_total_count;
      totalPages = Math.ceil(totalItems / postsPerPage);

      return data.row;
    });
};

const renderItem = async (start = 1) => {
  const $listWrapper = document.querySelector(".list-wrapper");
  $listWrapper.innerHTML = "";
  const data = await fetchData(
    `http://openapi.seoul.go.kr:8088/735a4d656177686734374978656774/json/ListPublicReservationEducation/${start}/${
      start + 9
    }/`
  );

  const itemHtml = data.map((row) => createItem(row)).join("");
  $listWrapper.innerHTML = itemHtml;
  renderPagination();
};

const renderPagination = () => {
  if (totalItems <= 10) return;

  const $pagination = document.querySelector(".pagination");
  $pagination.innerHTML = "";

  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  if (currentGroup > 1) {
    const prevGroupButton = document.createElement("i");
    prevGroupButton.className = "fa-solid fa-chevron-left";
    prevGroupButton.addEventListener("click", () => {
      currentGroup--;
      renderPagination();
    });
    $pagination.appendChild(prevGroupButton);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className = i === currentPage ? "on" : "";
    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderItem((currentPage - 1) * 10 + 1);
      renderPagination();
    });
    $pagination.appendChild(pageButton);
  }

  if (currentGroup * pagesPerGroup < totalPages) {
    const nextGroupButton = document.createElement("i");
    nextGroupButton.className = "fa-solid fa-chevron-right";
    nextGroupButton.addEventListener("click", () => {
      currentGroup++;
      renderPagination();
    });
    $pagination.appendChild(nextGroupButton);
  }
};

const renderDetails = () => {
  // todo
};

const init = async () => {
  renderItem();
};

// init();
