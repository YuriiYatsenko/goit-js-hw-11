import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('form');
const imageCardsContainer = document.querySelector('.image-cards');
const messageContainer = document.querySelector('.message');
let currentPage = 1;
const perPage = 20;
const lightbox = new SimpleLightbox('.image-cards a');
const loadMoreBtn = document.querySelector('.load-more');

const renderImageCards = (images) => {
  let imageCardsHTML = imageCardsContainer.innerHTML;

  images.forEach((image) => {
    const imageCardHTML = `
      <div class="image-card">
        <a href="${image.largeImageURL}">
          <img src="${image.webformatURL}" alt="${image.tags}" />
        </a>
        <h3>${image.tags}</h3>
      </div>
    `;
    imageCardsHTML += imageCardHTML;
  });

  imageCardsContainer.innerHTML = imageCardsHTML;
  lightbox.refresh();

  if (currentPage <= totalPages) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
  }
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const searchQuery = event.target.elements.searchQuery.value;
  currentPage = 1;

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '35626787-1bb82a1b86a7ccdeac34922a3',
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        page: currentPage,
      },
    });

    const images = response.data.hits;
    totalPages = Math.ceil(response.data.totalHits / perPage);

    renderImageCards(images);
    showMessage(response.data.totalHits);
    loadMoreBtn.style.display = 'block';
  } catch (error) {
    console.error(error);
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;

  try {
    const searchQuery = form.elements.searchQuery.value;
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '35626787-1bb82a1b86a7ccdeac34922a3',
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        page: currentPage,
      },
    });

    const images = response.data.hits;

    renderImageCards(images);
    scrollToTop(500);
  } catch (error) {
    console.error(error);
  }
});

const showMessage = (totalHits) => {
  const messageHTML = `
    <p>Hooray! We found ${totalHits} images.</p>
  `;
  messageContainer.innerHTML = messageHTML;
};