import { View } from './View';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _pages;

  addHandlerPages(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn-page');
      if (!btn) return;
      const { goToPage } = btn.dataset;
      if (+goToPage > this._pages || +goToPage === 0) return;
      handler(+goToPage);
    });
  }

  _generateMarkup(data) {
    const currentPage = data.page;
    this._pages = Math.ceil(data.results.length / data.res_per_page);

    if (this._pages === 1) return '';

    const paginationMarkup = [];

    for (let i = 1; i <= this._pages; i++) {
      paginationMarkup.push(
        `<a href="#results" class="btn-page ${
          currentPage === i ? 'active' : ''
        }" data-go-to-page="${i}">${i}</a>`
      );
    }

    return `
        <a href="#results" title="Go to previous page!" class="btn-page" data-go-to-page="${
          currentPage - 1
        }">&laquo;</a>
        ${paginationMarkup.join('')}
        <a href="#results" title="Go to next page!" class="btn-page" data-go-to-page="${
          currentPage + 1
        }">&raquo;</a>
    `;

    // if (currentPage === 1 && pages > 1) {
    //   return `
    //     <button class="btn--inline pagination__btn--next btn-page" data-go-to-page="${
    //       currentPage + 1
    //     }">
    //       <span>Page ${currentPage + 1}</span>
    //       <svg class="search__icon">
    //         <use href="${icons}#icon-arrow-right"></use>
    //       </svg>
    //     </button>
    //   `;
    // }

    // if (currentPage > 1 && currentPage < pages) {
    //   return `
    //     <button class="btn--inline pagination__btn--prev btn-page" data-go-to-page="${
    //       currentPage - 1
    //     }">
    //       <svg class="search__icon">
    //         <use href="${icons}#icon-arrow-left"></use>
    //       </svg>
    //       <span>Page ${currentPage - 1}</span>
    //     </button>
    //     <button class="btn--inline pagination__btn--next btn-page" data-go-to-page="${
    //       currentPage + 1
    //     }">
    //       <span>Page ${currentPage + 1}</span>
    //       <svg class="search__icon">
    //         <use href="${icons}#icon-arrow-right"></use>
    //       </svg>
    //     </button>
    //   `;
    // }

    // if (currentPage === pages && pages > 1) {
    //   return `
    //     <button class="btn--inline pagination__btn--prev btn-page" data-go-to-page="${
    //       currentPage - 1
    //     }">
    //       <svg class="search__icon">
    //         <use href="${icons}#icon-arrow-left"></use>
    //       </svg>
    //       <span>Page ${currentPage - 1}</span>
    //     </button>
    //   `;
    // }

    // return '';
  }
}

export default new PaginationView();
