import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('form');
const imageCardsContainer = document.querySelector('.image-cards');
const paginationContainer = document.querySelector('.pagination');
const messageContainer = document.querySelector('.message');
let currentPage = 1;
const perPage = 20;
const lightbox = new SimpleLightbox('.image-cards a');

const renderImageCards = (images) => {
  let imageCardsHTML = '';

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
};

const renderPaginationButtons = (currentPage, totalPages) => {
  let paginationButtonsHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const isActive = currentPage === i;
    const paginationButtonHTML = `
      <button class="${isActive ? 'active' : ''}" ${isActive ? 'disabled' : ''} data-page="${i}">${i}</button>
    `;
    paginationButtonsHTML += paginationButtonHTML;
  }

  paginationContainer.innerHTML = paginationButtonsHTML;
};

const scrollToTop = (duration) => {
  const start = window.pageYOffset;
  const distance = 0 - start;
  const startTime = performance.now();

  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const scroll = (timestamp) => {
    const currentTime = performance.now() - startTime;
    const timeFraction = currentTime / duration;
    const delta = easeInOutQuad(timeFraction);
    window.scrollTo(0, start + distance * delta);
    if (currentTime < duration) {
      requestAnimationFrame(scroll);
    }
  };

  requestAnimationFrame(scroll);
};

const showMessage = (totalHits) => {
  const messageHTML = `
    <p>Hooray! We found ${totalHits} images.</p>
  `;
  messageContainer.innerHTML = messageHTML;
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
    const totalPages = Math.ceil(response.data.totalHits / perPage);

    renderImageCards(images);
    renderPaginationButtons(currentPage, totalPages);
    showMessage(response.data.totalHits);
    scrollToTop(500);
  } catch (error) {
    console.error(error);
  }
});

paginationContainer.addEventListener('click', async (event) => {
  if (event.target.tagName === 'BUTTON') {
    const page = parseInt(event.target.dataset.page);
    currentPage = page;

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
      const totalPages = Math.ceil(response.data.totalHits / perPage);

      renderImageCards(images);
      renderPaginationButtons(currentPage, totalPages);
      scrollToTop(500);
    } catch (error) {
      console.error(error);
    }
  }
});