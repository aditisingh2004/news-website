

const API_KEY = "7fff00809a0b4511b753507a105977c1";
const BASE_URL = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload(){
  window.location.reload();
}

async function fetchNews(query) {
  try {
    const res = await fetch(`${BASE_URL}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    if (data.status !== "ok") throw new Error(data.message);
    bindData(data.articles);
  } catch (err) {
    console.error("Error fetching news:", err.message);
    // document.getElementById("cards-container").innerHTML = <p style="color:red;">Error loading news. Try again later.</p>;
  }
}

function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return;

    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector(".news-img");
  const newsTitle = cardClone.querySelector(".news-title");
  const newsSource = cardClone.querySelector(".news-source");
  const newsDesc = cardClone.querySelector(".news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description || "No description available";

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Kolkata"
  });
  newsSource.innerHTML = `${article.source.name} • ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

// Search functionality
const searchButton = document.querySelector(".search-button");
const searchInput = document.querySelector(".news-input");

searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchNews(query);
});

// Nav item click handling
document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", () => {
    const category = item.getAttribute("data-query");
    fetchNews(category);
  });
});


let curSelectedNav = null;
function onNavItemClick(id){
  fetchNews(id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove('active');
  curSelectedNav = navItem;
  curSelectedNav.classList.add('active');
}