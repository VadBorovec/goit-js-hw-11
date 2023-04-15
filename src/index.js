import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import NewsApiService from './js/PixabayApi.js';
import LoadMoreBtn from './js/components/LoadMoreBtn.js';

const refs = {
  form: document.getElementById('search-form'),
  newsWrapper: document.getElementById('gallery'),
};

const newsApiService = new NewsApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '#loadMore',
  isHidden: true,
});

refs.form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchArticles);
// function handleScroll() {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

//   console.log(scrollTop, scrollHeight, clientHeight);
//   if (scrollTop + clientHeight >= scrollHeight - 5) {
//     fetchArticles();
//   }
// }

// window.addEventListener("scroll", handleScroll);

function onSubmit(e) {
  e.preventDefault();
  loadMoreBtn.show();
  const form = e.currentTarget;
  // newsApiService.query = form.elements.news.value;
  newsApiService.query = form.elements.searchQuery.value;

  newsApiService.resetPage();
  clearNewsList();
  fetchArticles().finally(() => form.reset());
}

function fetchArticles() {
  loadMoreBtn.disable();
  return getArticlesMarkup()
    .then(markup => {
      updateNewsList(markup);
      loadMoreBtn.enable();
    })
    .catch(onError);
}

function getArticlesMarkup() {
  return newsApiService.getNews().then(({ hits }) => {
    if (hits.length === 0) throw new Error('No data!');
    return hits.reduce((markup, article) => markup + createMarkup(article), '');
  });
}

function createMarkup({
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
<div class="photo-card">
  <img
    src="${webformatURL}"
    alt="${tags}"
    loading="lazy"
  />
  <div class="info">
    <p class="info-item">
      ${likes}
      <b>Likes</b>
    </p>
    <p class="info-item">
      ${views}
      <b>Views</b>
    </p>
    <p class="info-item">
      ${comments}
      <b>Comments</b>
    </p>
    <p class="info-item">
      ${downloads}
      <b>Downloads</b>
    </p>
  </div>
</div>
  `;
}

// function createMarkup({ title, author, url, urlToImage, description }) {
//   return `
//     <div class="article-card">
//         <h2 class="article-title">${title}</h2>
//         <h3 class="article-author">${author || 'Unknown'}</h3>
//         <img src=${
//           urlToImage ||
//           'https://sun9-43.userapi.com/impf/c637716/v637716451/5754/CZa3BJtbJtg.jpg?size=520x0&quality=95&sign=02df8d0cd8ae78099bc1f50938efd60a'
//         } class="article-img">
//         <p class="article-description">${description}</p>
//         <a href=${url} target="_blank" class="article-link">Read more</a>
//     </div>
//   `;
// }

function updateNewsList(markup) {
  refs.newsWrapper.insertAdjacentHTML('beforeend', markup);
}

function clearNewsList() {
  refs.newsWrapper.innerHTML = '';
}

function onError(err) {
  console.error(err);
  loadMoreBtn.hide();
  clearNewsList();
  updateNewsList('<p>Not found!</p>');
}

/*
  1. Користувач робить запит
  2. Показується 5 перших результатів
  3. Знизу зʼявляється кнопка "Завантажити більше"
  4. Натискає на кнопку
  5. Відбувається новий запит на сервер і підвантажується 5 нових обʼєктів
  6. 5 нових результатів додаються до решти
*/
