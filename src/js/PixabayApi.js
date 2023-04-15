import axios from 'axios';

export default class PixabayApi {
  static ENDPOINT = 'https://pixabay.com/api/';
  static API_KEY = '35414846-cfeaf13fba8d2fde5a69a666b';

  constructor() {
    this.query = '';
    this.page = 1;
    this.perPage = 40;
  }

  async getImg() {
    const searchParams = {
      params: {
        q: this.searchQuery,
        page: this.page,
        per_page: this.perPage,
        image_type: 'photo',
        orientation: 'horizontal',
        key: PixabayApi.API_KEY,
      },
    };

    this.incrementPage();
    const res = await axios.get(PixabayApi.ENDPOINT, searchParams);
    return res.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
