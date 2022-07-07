import { View } from './View';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _bookmarksNumber = document.querySelector('.nav__number');
  _errorMessage = 'No bookmark yet! You can bookmarked a recipe!';

  _generateMarkup(data) {
    return data.map(this._generateMarkupResults).join('');
  }

  _generateMarkupResults(result) {
    const id = window.location.hash.slice(1);
    return `
      <li class="preview">
        <a class="preview__link ${
          id === result.id ? 'preview__link--active' : ''
        }" href="#${result.id}">
          <figure class="preview__fig">
            <img src="${result.image}" alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}</p>
          </div>
        </a>
      </li>
  `;
  }

  updateBookmarksNumber(number) {
    this._bookmarksNumber.textContent = number;
  }

  addBookmarksNumber() {
    this._bookmarksNumber.classList.remove('hidden');
  }

  removeBookmarksNumber() {
    this._bookmarksNumber.classList.add('hidden');
  }
}

export default new BookmarksView();
