class SearchView {
  _parentElement = document.querySelector('.search');
  _input = document.querySelector('.search__field');

  addHandlerSubmit(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  getQuery() {
    const query = this._input.value;
    this._input.value = '';
    return query;
  }
}

export default new SearchView();
