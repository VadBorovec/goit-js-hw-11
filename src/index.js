import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import PixabayApi from './js/PixabayApi.js';
import LoadMoreBtn from './js/components/LoadMoreBtn.js';

const refs = {
  form: document.getElementById('search-form'),
  newsWrapper: document.getElementById('gallery'),
};

const PixabayApi = new PixabayApi();
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
  PixabayApi.query = form.elements.searchQuery.value;

  PixabayApi.resetPage();
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
  return PixabayApi.getNews().then(({ hits }) => {
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
