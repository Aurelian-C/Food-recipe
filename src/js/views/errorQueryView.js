import { View } from './View';

class ErrorQueryView extends View {
  _parentElement = document.querySelector('.query-error-window');
  _overlay = document.querySelector('.overlay--error-query');
  _btnCloseModal = document.querySelector('.btn--close-query-window');

  addHandlerResultsError(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const query = e.target.closest('.query-container--word')?.textContent;
      if (!query) return;
      handler(query);
    });
  }

  toggleModalVisibility() {
    this._parentElement.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
}

export default new ErrorQueryView();
