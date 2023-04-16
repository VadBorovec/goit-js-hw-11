import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import PixabayApi from './js/PixabayApi.js';
import markupGallery from './js/templates/markupGallery.hbs';
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
const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

refs.form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchGallery);

function onSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;
  Api.query = form.elements.searchQuery.value.trim();

  if (!Api.query) {
    Notiflix.Notify.info('Please enter a search query.');
    return;
  }

  loadMoreBtn.show();
  Api.resetPage();
  clearGallery();
  fetchGallery().finally(() => form.reset());
}

function fetchGallery() {
  loadMoreBtn.disable();

  return getMarkup()
    .then(markup => {
      updateGallery(markup);
      loadMoreBtn.enable();
      pageScroll();
    })
    .catch(onError);
}

function getMarkup() {
  return Api.getImg()
    .then(({ hits, totalHits }) => {
      if (totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );

        onError('Not found!');
      } else {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

        const galleryItems = refs.gallery.querySelectorAll('.photo-card');
        const itemsLeft = totalHits - galleryItems.length;

        console.log('totalHits', totalHits);
        console.log('itemsLeft', itemsLeft);
        console.log('perPage', Api.perPage);
        console.log('page', Api.page);

        if (itemsLeft <= Api.perPage) {
          loadMoreBtn.hide();
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }

        return markupGallery(hits);
      }
    })
    .catch(onError);
}

function updateGallery(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function pageScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function onError(err) {
  console.error(err);
  loadMoreBtn.hide();
  clearGallery();
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
