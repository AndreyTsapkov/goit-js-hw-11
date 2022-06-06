import './sass/main.scss';
import {
  fetchImages,
  setSearchParams,
  incrementPage,
  resetPage,
  currentNumberOfImages,
  incrementCurrentNumberOfImages,
} from './js/fetchImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  buttonLoadMore: document.querySelector('.load-more'),
};

function renderCards(data) {
  const renderCards = data
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
        </div>`,
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', renderCards);
}

async function renderMarkup(event) {
  event.preventDefault();

  buttonLoadMoreHidden();
  cleanMarkup();
  resetPage();

  const userRequest = event.currentTarget.elements.searchQuery.value.trim();
  if (!userRequest) {
    return Notify.info('Please enter text for search');
  }
  setSearchParams(userRequest);

  //   console.log(searchParams.toString());
  try {
    const data = await fetchImages();
    incrementCurrentNumberOfImages();
    // console.log(data.hits);

    if (data.totalHits === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }

    renderCards(data.hits);
    var lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });
    lightbox.refresh();
    buttonLoadMoreVisible();
    checkEndGallery(data);
  } catch (error) {
    console.log(error.message);
  }
}
async function loadMore() {
  buttonLoadMoreHidden();

  try {
    incrementPage();

    const data = await fetchImages();
    incrementCurrentNumberOfImages();

    renderCards(data.hits);
    smoothScrolling();
    checkEndGallery(data);
    var lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });
    lightbox.refresh();
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
    top: cardHeight,
    behavior: 'smooth',
  });
}

function checkEndGallery(data) {
  if (currentNumberOfImages >= data.totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    buttonLoadMoreHidden();
  }
}

buttonLoadMoreHidden();
refs.searchForm.addEventListener('submit', renderMarkup);
refs.buttonLoadMore.addEventListener('click', loadMore);
