import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";
import { Notify } from "notiflix";
import './css/styles.css';
import LoadMoreBtn from './load-more-btn';


axios.defaults.baseURL = 'https://pixabay.com/api/';
const refs= {form: document.querySelector('#search-form'),
submit: document.querySelector('[type="submit"]'),
renderDiv: document.querySelector('.gallery'),
} 
const API_KEY = '29723422-b06f38d2a18d9cab8e97b2e74';
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});


refs.form.addEventListener('submit', onSubmit);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreBtnClick);
let searchQuery = '';
let page = 0;

loadMoreBtn.show()



function onSubmit(e) {
    e.preventDefault();
    
      searchQuery = e.currentTarget.elements.searchQuery.value.trim();
      loadMoreBtn.show()
      page = 1
      if (searchQuery === ""){
        return Notify.info("Please enter some text!")
      }
      loadMoreBtn.disable()
  axios.get(`/?key=${API_KEY}&q=${searchQuery}&image_type=photo&safesearch=true&orientation=horisontal&page=${page}&per_page=40`)
  .then(response => {clearPhotoMarkup();
    renderPhoto(response.data.hits);
    loadMoreBtn.enable()
     const totalHits = response.data.totalHits;    
     Notify.info(`Hooray! We found ${totalHits} images.`)
    if (response.data.hits.length === 0) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.")
  }
});
}

function onLoadMoreBtnClick(e) {
  page += 1;
   axios.get(`/?key=${API_KEY}q=${searchQuery}&image_type=photo&safesearch=true&orientation=horisontal&page=${page}&per_page=40`)
  .then(response => {renderPhoto(response.data.hits)});
  
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