import './sass/main.scss';
import { fetchImages, setSearchParams, incrementPage } from './js/fetchImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;
const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  buttonLoadMore: document.querySelector('.load-more'),
};
let currentNumberofImages = 0;
function renderCards(data) {
  const renderOneCard = data
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
        <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
        <p class="info-item">
        <b>Likes</b>
        ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>;`,
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', renderOneCard);
}

async function renderMarkup(event) {
  event.preventDefault();
  buttonLoadMoreHidden();
  cleanMarkup();

  const userRequest = event.currentTarget.elements.searchQuery.value.trim();
  if (!userRequest) {
    return Notify.info('Please enter text for search');
  }
  setSearchParams(userRequest);

  //   console.log(searchParams.toString());
  const data = await fetchImages();
  console.log(data.hits);
  if (data.totalHits === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
  renderCards(data.hits);
  buttonLoadMoreVisible();
}
async function loadMore() {
  buttonLoadMoreHidden();
  try {
    incrementPage();
    const data = await fetchImages();
    renderCards(data.hits);
    smoothScrolling();
  } catch (error) {
    console.log('error:', error.message);
  }

  buttonLoadMoreVisible();
}
function buttonLoadMoreHidden() {
  refs.buttonLoadMore.classList.add('visually-hidden');
}
function buttonLoadMoreVisible() {
  refs.buttonLoadMore.classList.remove('visually-hidden');
}
function cleanMarkup() {
  refs.gallery.innerHTML = '';
}
function smoothScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

buttonLoadMoreHidden();
refs.searchForm.addEventListener('submit', renderMarkup);
refs.buttonLoadMore.addEventListener('click', loadMore);
