import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";
import { Notify } from "notiflix";
import './css/styles.css';
import LoadMoreBtn from './load-more-btn';
import simpleLightbox from "simplelightbox";


axios.defaults.baseURL = 'https://pixabay.com/api/';
const refs= {form: document.querySelector('#search-form'),
submit: document.querySelector('[type="submit"]'),
// submitBtn: document.querySelector('button.search'),
renderDiv: document.querySelector('.gallery'),
} 
const API_KEY = '29723422-b06f38d2a18d9cab8e97b2e74';
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});  

refs.form.addEventListener('submit', onSubmit);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreBtnClick);


let searchQuery = '';
let page;
let image = 0;
let per_page;


async function onSubmit(e) {
    e.preventDefault();
        searchQuery = e.currentTarget.elements.searchQuery.value.trim();
        page = 0;
        per_page = 40;
        if (searchQuery === ""){
        return Notify.info("Please enter some text!")
      }
       
           page += 1;
      try {const response = await axios.get(`/?key=${API_KEY}&q=${searchQuery}&image_type=photo&safesearch=true&orientation=horisontal&page=${page}&per_page=${per_page}`)
      
      clearPhotoMarkup();
    renderPhoto(response.data.hits);
    lightbox.refresh()
    
    if (response.data.hits.length === 0) {
      loadMoreBtn.disable()
      Notify.failure("Sorry, there are no images matching your search query. Please try again.")
      return;
  }

  loadMoreBtn.show()
     loadMoreBtn.enable();
    const totalHits = response.data.totalHits;    

  if (totalHits >= 1) {
    Notify.info(`Hooray! We found ${totalHits} images.`)
  }
  image = totalHits - per_page;
       } catch (error) {
      console.error(error);
      }  
        };

async function onLoadMoreBtnClick(e) {
  loadMoreBtn.disable();
  page += 1;
  if (per_page >= image) {
    per_page = image;
  }image -= per_page;
    
  try { const response = await axios.get(`/?key=${API_KEY}&q=${searchQuery}&image_type=photo&safesearch=true&orientation=horisontal&page=${page}&per_page=${per_page}`)
  renderPhoto(response.data.hits);
  lightbox.refresh()
  
  const { height: cardHeight } = document
.querySelector(".gallery")
.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
  
  loadMoreBtn.enable();
  if (per_page < 40) {
    Notify.info("We're sorry, but you've reached the end of search results.")
    loadMoreBtn.hide();
  }
  } catch (error) {
  console.error(error);  
  } 
  }

function renderPhoto(arr) {
    const markup = arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
      <a class="photo-link" href="${largeImageURL}">
      <img class="image" src="${webformatURL}" alt="${tags}" loading="lazy"  width="300" height="300"/>
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes: ${likes}</b>
        </p>
        <p class="info-item">
        <b>Downloads: ${downloads}</b>
      </p>
        <p class="info-item">
          <b>Views: ${views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${comments}</b>
        </p>
       
      </div>
    </div>`
    }).join('');

    refs.renderDiv.insertAdjacentHTML('beforeend', markup);
       
};

function clearPhotoMarkup() {
  refs.renderDiv.innerHTML = '';
}


