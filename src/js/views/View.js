import icons from '../../img/icons.svg';

export class View {
  _data;

  render(data) {
    if (Array.isArray(data) && data.length === 0) return this.errorMessage();
    this._data = data;
    const markup = this._generateMarkup(this._data);
    this._clear();
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(this._data);
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = [...newDOM.querySelectorAll('*')];
    const currentElements = [...this._parentElement.querySelectorAll('*')];

    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.textContent = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }

  errorMessage(message = this._errorMessage, queries = undefined) {
    let queriesMarkup;

    if (queries) {
      queriesMarkup = queries
        .map(query => `<li class="query-container--word">${query}</li>`)
        .join('');
    }

    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
        ${queries ? `<ul class="query-container">${queriesMarkup}<ul/>` : ''}
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }
}
