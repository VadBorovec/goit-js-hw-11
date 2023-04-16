import axios from 'axios';

export default class PixabayApi {
  static ENDPOINT = 'https://pixabay.com/api/';
  static API_KEY = '35414846-cfeaf13fba8d2fde5a69a666b';
  static searchParams = new URLSearchParams({
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 40,
  });

  constructor() {
    this.query = '';
    this.page = 1;
  }

  async getImg() {
    this.incrementPage();
    const res = await axios.get(
      `${PixabayApi.ENDPOINT}?key=${PixabayApi.API_KEY}&q=${this.query}&${PixabayApi.searchParams}&page=${this.page}`
    );
    return res.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
