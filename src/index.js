import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import PixabayApi from './js/PixabayApi.js';
import LoadMoreBtn from './js/components/LoadMoreBtn.js';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.getElementById('gallery'),
};

const Api = new PixabayApi();
const loadMoreBtn = new LoadMoreBtn({
  selector: '#loadMore',
  isHidden: true,
});

refs.form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchGallery);

function onSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;
  Api.query = form.elements.searchQuery.value;

  if (Api.query === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }

  loadMoreBtn.show();
  Api.resetPage();
  clearGallery();
  fetchGallery().finally(() => form.reset());
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

function updateGallery(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function getMarkup() {
  return Api.getImg().then(({ hits }) => {
    if (hits.totalHits === 0)
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    return hits.reduce((markup, card) => markup + createMarkup(card), '');
  });
}

function fetchGallery() {
  loadMoreBtn.disable();
  return getMarkup()
    .then(markup => {
      updateGallery(markup);
      loadMoreBtn.enable();
    })
    .catch(onError);
}

function onError(err) {
  console.error(err);
  loadMoreBtn.hide();
  clearGallery();
  updateGallery('<p>Not found!</p>');
}

// !================
// // func for endless scroll
// function handleScroll() {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
//   if (scrollTop + clientHeight >= scrollHeight - 5) {
//     fetchGallery();
//   }
// }

// window.addEventListener('scroll', handleScroll);
