import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";
import { Notify } from "notiflix";
import './css/styles.css';
import LoadMoreBtn from './load-more-btn';
import SearchBtn from "./search-btn";


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

const searchBtn = new SearchBtn({
  selector: '[data-action="search"]', 
  hidden: false,})


refs.form.addEventListener('submit', onSubmit);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreBtnClick);
let searchQuery = '';
let page = 0;
let totalHits =0;
let image =0;

function onSubmit(e) {
    e.preventDefault();
      searchQuery = e.currentTarget.elements.searchQuery.value.trim();
      
      page = 1;
      image = 40;
      if (searchQuery === ""){
        return Notify.info("Please enter some text!")
      }
      
      loadMoreBtn.show()
      loadMoreBtn.disable()
        axios.get(`/?key=${API_KEY}&q=${searchQuery}&image_type=photo&safesearch=true&orientation=horisontal&page=${page}&per_page=40`)
  .then(response => {clearPhotoMarkup();
    renderPhoto(response.data.hits);
    
    loadMoreBtn.enable();
    searchBtn.disable();
        totalHits = response.data.totalHits;    
    Notify.info(`Hooray! We found ${totalHits} images.`)
    if (response.data.hits.length === 0) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.")
  }});
}

function onLoadMoreBtnClick(e) {
  loadMoreBtn.disable();
  page += 1;
  image +=40;
   axios.get(`/?key=${API_KEY}q=${searchQuery}&image_type=photo&safesearch=true&orientation=horisontal&page=${page}&per_page=40`)
  .then(response => {renderPhoto(response.data.hits);
    loadMoreBtn.enable();
    if (totalHits <= image) {
      Notify.info("We're sorry, but you've reached the end of search results.")
      loadMoreBtn.hide();
    }
    });
   
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


  // Notify.info(`Hooray! We found ${totalHits} images.`)
// const AUTH_TOKEN = 29723422-b06f38d2a18d9cab8e97b2e74;

// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

// const options = {
//     headers: {
//         // AUTH_TOKEN = 29723422-b06f38d2a18d9cab8e97b2e74,
//         // q: "cat",
//         image_type:  "photo",
//         orientation:  "horizontal",
//         safesearch: true,
  // }
// }

//   async function getUser() {
//     try {
//       const response = await axios.get('/user?ID=12345');
//       console.log(response);
//     } catch (error) {
//       console.error(error);
//     }
//   }