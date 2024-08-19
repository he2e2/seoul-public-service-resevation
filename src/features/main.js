import { renderingMap, renderingDetailMap } from "./map.js";
import { createItem, createURL } from "./create.js";

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

// fetch data

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.RESULT) return data.RESULT.MESSAGE;

    totalItems = data.ListPublicReservationEducation.list_total_count;
    totalPages = Math.ceil(totalItems / postsPerPage);
    return data.ListPublicReservationEducation.row;
  } catch (e) {
    console.error(e);
  }
};

// render item

const renderItem = async (data) => {
  if (data === "해당하는 데이터가 없습니다.") {
    $input.value = "";
    window.alert(data);
    return;
  }

  const $listWrapper = document.querySelector(".list-wrapper");
  $listWrapper.innerHTML = data.map(createItem).join("");

  renderPagination();

  const $lists = document.querySelectorAll(".list");
  $lists.forEach((list, index) => {
    list.addEventListener("click", () => handleDetailClick(index));
  });
};

// handling item click

const handleDetailClick = async (index) => {
  const dataIdx = (currentPage - 1) * postsPerPage + index + 1;

  const data = await fetchData(
    createURL(dataIdx, $select.value, $input.value, true)
  );

  toggleDetailView();

  renderingDetailMap(document.querySelector(".map"), data);
  renderingDetailMap(document.querySelector(".mobile-map"), data);

  document.querySelectorAll(".reservation").forEach((r) => {
    r.href = data[0].SVCURL;
  });

  document.querySelectorAll(".contents").forEach((con) => {
    con.innerHTML = data[0].DTLCONT.replace(/<img[^>]*>/g, "");
  });
};

const toggleDetailView = () => {
  document.querySelector(".mobile-detail-con").classList.toggle("active");
  document.querySelector(".map").style.height = "calc(100% - 25rem)";
  document.querySelector(".details").style.display = "flex";

  document.querySelector(".map").innerHTML = "";
  document.querySelector(".mobile-map").innerHTML = "";
};

// pagination

const renderPagination = () => {
  if (totalItems <= postsPerPage) {
    const $pagination = document.querySelector(".pagination");
    $pagination.innerHTML = "";
    return;
  }

  const $pagination = document.querySelector(".pagination");
  $pagination.innerHTML = "";

  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  if (currentGroup > 1) addPaginationButton($pagination, "left");
  for (let i = startPage; i <= endPage; i++) addPageButton($pagination, i);
  if (currentGroup * pagesPerGroup < totalPages)
    addPaginationButton($pagination, "right");
};

const renderForPagination = async (page) => {
  const data = await fetchData(
    createURL((page - 1) * postsPerPage + 1, $select.value, $input.value)
  );
  renderItem(data);
  renderingMap(document.querySelector(".map"), data);
};

const addPaginationButton = ($pagination, direction) => {
  const iconClass = `fa-solid fa-chevron-${direction}`;
  const button = document.createElement("i");
  button.className = iconClass;
  button.addEventListener("click", () => handlePaginationClick(direction));
  $pagination.appendChild(button);
};

const addPageButton = ($pagination, pageNumber) => {
  const pageButton = document.createElement("button");
  pageButton.textContent = pageNumber;
  pageButton.className = pageNumber === currentPage ? "on" : "";
  pageButton.addEventListener("click", () => {
    currentPage = pageNumber;
    renderForPagination(currentPage);
    renderPagination();
  });
  $pagination.appendChild(pageButton);
};

const handlePaginationClick = (direction) => {
  currentGroup = direction === "left" ? currentGroup - 1 : currentGroup + 1;
  currentPage =
    direction === "left"
      ? pagesPerGroup * currentGroup
      : (currentGroup - 1) * pagesPerGroup + 1;

  renderForPagination(currentPage);
  renderPagination();
};

// search

const searchKeywords = async () => {
  currentPage = 1;
  currentGroup = 1;

  const data = await fetchData(createURL(1, $select.value, $input.value));
  renderItem(data);
  renderingMap(document.querySelector(".map"), data);
};

$searchBtn.addEventListener("click", () => {
  searchKeywords();
});

document.getElementById("search").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.keyCode === 13) searchKeywords();
});

// category

$categories.forEach((category, index) => {
  category.addEventListener("click", () => {
    handleCategoryClick(index);
  });
});

const handleCategoryClick = (index) => {
  $categories.forEach((cat) => cat.classList.remove("selected"));
  $categories[index].classList.add("selected");

  $input.value = "";
  searchCategory();
};

const searchCategory = async () => {
  currentPage = 1;
  currentGroup = 1;

  const data = await fetchData(createURL());
  renderItem(data);
  renderingMap(document.querySelector(".map"), data);
};

document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".categories").classList.toggle("active");
});

document.querySelector(".categories .fa-x").addEventListener("click", () => {
  document.querySelector(".categories").classList.toggle("active");
});

document.querySelector(".detail-con-close").addEventListener("click", () => {
  document.querySelector(".mobile-detail-con").classList.toggle("active");
});

// init

const init = async () => {
  const data = await fetchData(createURL());
  renderItem(data);
  renderingMap(document.querySelector(".map"), data);
};

init();
