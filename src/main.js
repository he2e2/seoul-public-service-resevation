import { renderingMap, renderingDetailMap } from "./map.js";

const apiKey = import.meta.env.VITE_API_KEY;

const postsPerPage = 10;
const pagesPerGroup = 5;

let totalItems;
let currentPage = 1;
let currentGroup = 1;
let totalPages = Math.ceil(totalItems / postsPerPage);

const $select = document.getElementById("search-type");
const $input = document.getElementById("search");
const $searchBtn = document.querySelector(".search-bar button");
const $categories = document.querySelectorAll(".categories button");
const $mobileCategories = document.querySelectorAll(".mobile-cate button");

const createItem = (event) => {
  let statusClassName = "";
  if (event.SVCSTATNM === "접수중" || event.SVCSTATNM === "안내중")
    statusClassName = "blue";
  else if (event.SVCSTATNM === "예약일시중지") statusClassName = "red";
  else if (event.SVCSTATNM === "접수종료" || event.SVCSTATNM === "예약마감")
    statusClassName = "gray";

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

const createURL = (start = 1, option = "%20", keywords = "%20") => {
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

const fetchData = async (url) => {
  return await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.RESULT) return data.RESULT.MESSAGE;

      data = data.ListPublicReservationEducation;
      totalItems = data.list_total_count;
      totalPages = Math.ceil(totalItems / postsPerPage);

      return data.row;
    });
};

const renderItem = async (data) => {
  if (data === "해당하는 데이터가 없습니다.") {
    window.alert(data);
    return;
  }

  const $listWrapper = document.querySelector(".list-wrapper");
  $listWrapper.innerHTML = "";

  const itemHtml = data.map((row) => createItem(row)).join("");
  $listWrapper.innerHTML = itemHtml;
  renderPagination();

  // add details
  const $lists = document.querySelectorAll(".list");
  $lists.forEach((list, index) => {
    list.addEventListener("click", async () => {
      const dataIdx = (currentPage - 1) * 10 + index + 1;

      let selectedCategory = document.querySelector(".selected").textContent;
      selectedCategory =
        selectedCategory === "전체" ? "%20" : selectedCategory.split("/")[0];

      const selectedOption = $select.value;
      const inputValue = $input.value;

      let additionalURL = "";
      if (inputValue !== "") {
        if (selectedOption === "service-name") additionalURL = `${inputValue}/`;
        else if (selectedOption === "service-person")
          additionalURL = `%20/${inputValue}/`;
        else if (selectedOption === "region")
          additionalURL = `%20/%20/${inputValue}/`;
      }

      const data = await fetchData(
        `http://openapi.seoul.go.kr:8088/${apiKey}/json/ListPublicReservationEducation/${dataIdx}/${dataIdx}/${selectedCategory}/${additionalURL}`
      );

      renderingDetailMap(document.querySelector(".map"), data);
      renderingDetailMap(document.querySelector(".mobile-map"), data);

      document.querySelector(".mobile-detail-con").classList.toggle("active");

      document.querySelector(".map").style.height = "calc(100% - 40rem)";
      document.querySelector(".details").style.display = "flex";

      const $reservationBtn = document.querySelectorAll(".reservation");
      $reservationBtn.forEach((r) => {
        r.href = data[0].SVCURL;
      });

      const $contentsCons = document.querySelectorAll(".contents");

      $contentsCons.forEach((con) => {
        con.innerHTML = data[0].DTLCONT.replace(/<img[^>]*>/g, "");
      });
    });
  });
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
    pageButton.addEventListener("click", async () => {
      currentPage = i;

      const selectedOption = $select.value;
      const inputValue = $input.value;

      const data =
        inputValue === ""
          ? await fetchData(createURL((currentPage - 1) * 10 + 1))
          : await fetchData(
              createURL((currentPage - 1) * 10 + 1, selectedOption, inputValue)
            );

      renderItem(data);
      renderingMap(document.querySelector(".map"), data);
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

const searchKeywords = async () => {
  const selectedOption = $select.value;
  const inputValue = $input.value;

  const data = await fetchData(createURL(1, selectedOption, inputValue));
  renderItem(data);
  renderingMap(document.querySelector(".map"), data);
};

const searchCategory = async () => {
  const data = await fetchData(createURL());
  renderItem(data);
  renderingMap(document.querySelector(".map"), data);
};

$searchBtn.addEventListener("click", () => {
  searchKeywords();
});

document.getElementById("search").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.keyCode === 13) {
    searchKeywords();
  }
});

$categories.forEach((category, index) => {
  category.addEventListener("click", () => {
    $categories.forEach((cat) => cat.classList.remove("selected"));
    $mobileCategories.forEach((cat) => cat.classList.remove("selected"));

    category.classList.add("selected");
    $mobileCategories[index].classList.add("selected");
    searchCategory();
  });
});

$mobileCategories.forEach((category, index) => {
  category.addEventListener("click", () => {
    $categories.forEach((cat) => cat.classList.remove("selected"));
    $mobileCategories.forEach((cat) => cat.classList.remove("selected"));

    category.classList.add("selected");
    $categories[index].classList.add("selected");
    searchCategory();

    document.querySelector(".mobile-cate").classList.toggle("active");
  });
});

document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".mobile-cate").classList.toggle("active");
});

document.querySelector(".mobile-cate .fa-x").addEventListener("click", () => {
  document.querySelector(".mobile-cate").classList.toggle("active");
});

document
  .querySelector(".mobile-detail-con .fa-x")
  .addEventListener("click", () => {
    document.querySelector(".mobile-detail-con").classList.toggle("active");
  });

const init = async () => {
  const data = await fetchData(createURL());
  renderItem(data);
  renderingMap(document.querySelector(".map"), data);
};

init();
