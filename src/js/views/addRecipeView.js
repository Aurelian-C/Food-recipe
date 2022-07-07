import { View } from './View';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _modal = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');

  constructor() {
    super();

    [this._btnOpen, this._btnClose, this._overlay].forEach(el =>
      el.addEventListener('click', this.toggleModalVisibility.bind(this))
    );
  }

  addHandlerSubmit(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const inputsEntries = [...new FormData(this)];
      const inputsObject = Object.fromEntries(inputsEntries);
      handler(inputsObject);
    });
  }

  toggleModalVisibility() {
    this._modal.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
}

export default new AddRecipeView();
