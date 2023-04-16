import axios from 'axios';

export default class PixabayApi {
  static ENDPOINT = 'https://pixabay.com/api/';
  static API_KEY = '35414846-cfeaf13fba8d2fde5a69a666b';
  static searchParams = new URLSearchParams({
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });

  constructor() {
    this.query = '';
    this.perPage = 40;
    this.page = 1;
  }

  async getImg() {
    this.incrementPage();
    const res = await axios.get(
      `${PixabayApi.ENDPOINT}?key=${PixabayApi.API_KEY}&q=${this.query}&${PixabayApi.searchParams}&per_page=${this.perPage}&page=${this.page}`
    );
    this.totalHits = res.data.totalHits;
    return res.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 0;
  }

  getQuery() {
    return this.query;
  }

  setQuery(newQuery) {
    this.query = newQuery;
  }
}
