export default class PixabayApi {
  static ENDPOINT = 'https://pixabay.com/api/';
  static API_KEY = '35414846-cfeaf13fba8d2fde5a69a666b';
  static PARAMTERS =
    '&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

  constructor() {
    this.query = '';
    this.page = 1;
  }

  getNews() {
    const url = `${PixabayApi.ENDPOINT}?key=${PixabayApi.API_KEY}&q=${this.query}${PixabayApi.PARAMTERS}&page=${this.page}`;

    return fetch(url).then(data => {
      this.incrementPage();
      return data.json();
    });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
