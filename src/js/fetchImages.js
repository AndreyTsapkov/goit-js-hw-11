const axios = require('axios').default;
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
let pageCounter = 1;
export async function fetchImages() {
  const { data } = await axios.get(`${URL}?${searchParams}`);
  console.log(data);
  return data;
}

export function setSearchParams(params) {
  searchParams.set('q', params);
}

export function incrementPage() {
  searchParams.set('page', (pageCounter += 1));
}
