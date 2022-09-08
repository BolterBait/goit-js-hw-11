import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";
import {Notiflix} from "notiflix";
import './css/styles.css';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const refs= {form: document.querySelector('#search-form'),
loadMoreBtn: document.querySelector('button.load-more'),
submit: document.querySelector('[type="submit"]'),
renderDiv: document.querySelector('.gallery'),
} 

refs.form.addEventListener('submit', onSubmit)


function onSubmit(e) {
    e.preventDefault();
    const searchQuery = e.currentTarget.elements.searchQuery.value
    axios.get(`/?key=29723422-b06f38d2a18d9cab8e97b2e74&q=${searchQuery}&image_type=photo&safesearch=true&orientation=horisontal`)
  .then(response => {renderPhoto(response.data.hits)});}

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
