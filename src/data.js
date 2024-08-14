const postsPerPage = 10;
const pagesPerGroup = 5;

let totalItems;
let currentPage = 1;
let currentGroup = 1;
let totalPages = Math.ceil(totalItems / postsPerPage);

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
    return `http://openapi.seoul.go.kr:8088/735a4d656177686734374978656774/json/ListPublicReservationEducation/${start}/${
      start + 9
    }/${selectedCategory}/${keywords}`;
  else if (option === "service-person")
    return `http://openapi.seoul.go.kr:8088/735a4d656177686734374978656774/json/ListPublicReservationEducation/${start}/${
      start + 9
    }/${selectedCategory}/%20/${keywords}`;
  else if (option === "region")
    return `http://openapi.seoul.go.kr:8088/735a4d656177686734374978656774/json/ListPublicReservationEducation/${start}/${
      start + 9
    }/${selectedCategory}/%20/%20/${keywords}`;
  else
    return `http://openapi.seoul.go.kr:8088/735a4d656177686734374978656774/json/ListPublicReservationEducation/${start}/${
      start + 9
    }/${selectedCategory}`;
};

const fetchData = async (url) => {
  return await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data = data.ListPublicReservationEducation;
      totalItems = data.list_total_count;
      totalPages = Math.ceil(totalItems / postsPerPage);

      // todo : 데이터가 없는 경우

      return data.row;
    });
};

const renderItem = async (data) => {
  const $listWrapper = document.querySelector(".list-wrapper");
  $listWrapper.innerHTML = "";

  const itemHtml = data.map((row) => createItem(row)).join("");
  $listWrapper.innerHTML = itemHtml;
  renderPagination();

  const $lists = document.querySelectorAll(".list");
  $lists.forEach((list, index) => {
    list.addEventListener("click", async () => {
      const dataIdx = (currentPage - 1) * 10 + index + 1;
      // 현재 카테고리 전체 & search 없는 경우에만 동작
      // todo : 카테고리, keyword 반영

      const data = await fetchData(
        `http://openapi.seoul.go.kr:8088/735a4d656177686734374978656774/json/ListPublicReservationEducation/${dataIdx}/${dataIdx}/`
      );

      document.querySelector(".mobile-detail-con").classList.toggle("active");

      document.querySelector(".map").style.height = "calc(100% - 40rem)";
      document.querySelector(".details").style.display = "flex";

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
      // todo : search data도 유지하도록 수정
      const data = await fetchData(createURL((currentPage - 1) * 10 + 1));
      renderItem(data);
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

const $select = document.getElementById("search-type");
const $input = document.getElementById("search");
const $searchBtn = document.querySelector(".search-bar button");
const $categories = document.querySelectorAll(".categories button");
const $mobileCategories = document.querySelectorAll(".mobile-cate button");

const searchKeywords = async () => {
  const selectedOption = $select.value;
  const inputValue = $input.value;

  const data = await fetchData(createURL(1, selectedOption, inputValue));
  renderItem(data);
};

const searchCategory = async () => {
  const data = await fetchData(createURL());
  renderItem(data);
};

$searchBtn.addEventListener("click", () => {
  searchKeywords();
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

// todo : 모바일 카테고리 선택하면 창 없애기
$mobileCategories.forEach((category, index) => {
  category.addEventListener("click", () => {
    $categories.forEach((cat) => cat.classList.remove("selected"));
    $mobileCategories.forEach((cat) => cat.classList.remove("selected"));

    category.classList.add("selected");
    $categories[index].classList.add("selected");
    searchCategory();
  });
});

const init = async () => {
  const data = await fetchData(createURL());
  renderItem(data);
};

// init();
