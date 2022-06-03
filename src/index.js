import './sass/main.scss';
const axios = require('axios').default;
const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};
const URL = 'https://pixabay.com/api/';
const searchParams = new URLSearchParams({
  key: '27784898-08f565a22f2602ecd9f874e94',
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  page: 1,
  per_page: 40,
});

async function fetchImages() {
  const { data } = await axios.get(`${URL}?${searchParams}`);
  console.log(data.hits);
  return data.hits;
}

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
  refs.gallery.innerHTML = renderOneCard;
}

async function renderMarkup(event) {
  event.preventDefault();
  const userRequest = event.currentTarget.elements.searchQuery.value.trim();
  searchParams.set('q', userRequest);
  console.log(searchParams.toString());
  const data = await fetchImages();
  renderCards(data);
}
refs.searchForm.addEventListener('submit', renderMarkup);
