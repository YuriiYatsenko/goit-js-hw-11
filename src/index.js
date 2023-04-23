const form = document.querySelector('form');
const imageCardsContainer = document.querySelector('.image-cards');
const paginationContainer = document.querySelector('.pagination');
let currentPage = 1;
const perPage = 20;

const renderImageCards = (images) => {
  let imageCardsHTML = '';  images.forEach((image) => {
    const imageCardHTML = `
      <div class="image-card">
        <img src="${image.webformatURL}" alt="${image.tags}" />
        <h3>${image.tags}</h3>
      </div>
    `;
    imageCardsHTML += imageCardHTML;
  });

  imageCardsContainer.innerHTML = imageCardsHTML;
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
    } catch (error) {
      console.error(error);
    }
  }
});