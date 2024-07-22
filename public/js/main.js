// API key to authenticate requests to the NewsAPI
const apiKey = "5ae119faa1ee457c88fab2ae215b1e78";
const cardContainer = document.querySelector("#card-cont");
// Number of articles to display on the page
const desiredArticleCount = 20;
const searchField = document.querySelector("#simple-search");
const searchButton = document.querySelector("#search-button");

// Utility function to fetch articles from a given URL
async function fetchArticles(url) {
  try {
    // Fetch data from the provided URL
    const response = await fetch(url);
    // Parse the JSON response into an object
    const data = await response.json();
    // Return the list of articles, or an empty array if none found
    return data.articles || [];
  } catch (error) {
    // Log errors to the console if something goes wrong
    console.error(`Error fetching articles`, error);
    return [];
  }
}

// Utility function to create a card element for an article
function createArticleCard(article) {
  // Create a div element for the card
  const cardDiv = document.createElement("div");
  // Add classes to style the card
  cardDiv.classList.add(
    "xs:max-w-xs",
    "card",
    "max-w-full",
    "rounded-lg",
    "border",
    "border-gray-200",
    "bg-white",
    "shadow-md",
    "dark:border-gray-700",
    "dark:bg-gray-800",
  );

  // Create and configure the image element
  const myImg = document.createElement("img");
  myImg.classList.add("rounded-t-lg");
  myImg.src = article.urlToImage || ""; // Use a placeholder if no image is available
  myImg.alt = article.title || "Image not available"; // Alt text for accessibility

  // Create a link element for the image
  const aTag = document.createElement("a");
  aTag.href = article.url || "#"; // Link to the full article
  aTag.target = "_blank"; // Open link in a new tab
  aTag.appendChild(myImg); // Add the image to the link

  // Create a div for the article content
  const contentDiv = document.createElement("div");
  contentDiv.classList.add("p-5");

  // Create a link element for the article title
  const titleLink = document.createElement("a");
  titleLink.href = article.url || "#";
  titleLink.target = "_blank";

  // Create an h5 element for the article title
  const title = document.createElement("h5");
  title.classList.add(
    "mb-2",
    "text-2xl",
    "font-bold",
    "tracking-tight",
    "text-gray-900",
    "dark:text-white",
  );
  // Truncate title if it's too long
  title.textContent =
    article.title.length > 30
      ? `${article.title.slice(0, 30)}...`
      : article.title;
  titleLink.appendChild(title);

  // Create a paragraph element for the article description
  const description = document.createElement("p");
  description.classList.add(
    "mb-3",
    "font-normal",
    "text-gray-700",
    "dark:text-gray-400",
  );
  // Truncate description if it's too long
  description.textContent =
    article.description.length > 100
      ? `${article.description.slice(0, 100)}...`
      : article.description;

  // Create a link element for "Read more"
  const readMoreLink = document.createElement("a");
  readMoreLink.classList.add(
    "inline-flex",
    "items-center",
    "rounded-lg",
    "bg-blue-700",
    "px-3",
    "py-2",
    "text-center",
    "text-sm",
    "font-medium",
    "text-white",
    "hover:bg-blue-800",
    "focus:outline-none",
    "focus:ring-4",
    "focus:ring-blue-300",
    "dark:bg-blue-600",
    "dark:hover:bg-blue-700",
    "dark:focus:ring-blue-800",
  );
  readMoreLink.href = article.url || "#";
  readMoreLink.target = "_blank";
  readMoreLink.textContent = "Read more";

  // Create an SVG icon for the "Read more" link
  const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgIcon.classList.add("ms-2", "h-3.5", "w-3.5", "rtl:rotate-180");
  svgIcon.setAttribute("aria-hidden", "true");
  svgIcon.setAttribute("fill", "none");
  svgIcon.setAttribute("viewBox", "0 0 14 10");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("d", "M1 5h12m0 0L9 1m4 4L9 9");
  svgIcon.appendChild(path);
  readMoreLink.appendChild(svgIcon);

  // Append the content to the card
  contentDiv.appendChild(titleLink);
  contentDiv.appendChild(description);
  contentDiv.appendChild(readMoreLink);
  cardDiv.appendChild(aTag);
  cardDiv.appendChild(contentDiv);

  // Return the completed card element
  return cardDiv;
}

// Fetch articles from the API and display them
async function fetchAndDisplayArticles(url) {
  // Fetch articles from the given URL
  const articles = await fetchArticles(url);
  // Filter articles to include only valid ones
  const filteredArticles = filterArticles(articles);
  // Clear any existing articles
  cardContainer.innerHTML = "";
  // Create and append a card for each article
  filteredArticles.slice(0, desiredArticleCount).forEach((article) => {
    const card = createArticleCard(article);
    cardContainer.appendChild(card);
  });
}

// Filter articles to include only those published this year
function filterArticles(articles) {
  const currentYear = new Date().getFullYear();
  return articles.filter((article) => {
    // Convert the published date to a Date object
    const publishedDate = new Date(article.publishedAt);
    // Check if article has an image, title, description, and was published this year
    return (
      article.urlToImage &&
      article.title &&
      article.description &&
      publishedDate.getFullYear() === currentYear
    );
  });
}

// Set up event listener for the search button
searchButton.addEventListener("click", async (event) => {
  event.preventDefault(); // Prevent the default form submission
  const query = searchField.value.trim(); // Get the search query
  if (query) {
    // Build the URL for the search query
    const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=30&apiKey=${apiKey}`;
    // Fetch and display articles based on the search query
    await fetchAndDisplayArticles(apiUrl);
  }
});

// Initial fetch and display of articles on page load
(async () => {
  // Build the URL for top headlines
  const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=30&apiKey=${apiKey}`;
  // Fetch and display top headlines
  await fetchAndDisplayArticles(apiUrl);
})();
