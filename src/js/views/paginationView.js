// 分页器
import View from './View.js';
import icons from 'url:../../img/icons.svg'

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination')

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn--inline');
      if(!btn) return;

      const goTopage = +btn.dataset.goto;
      handler(goTopage)
    })
  }

  _generateMarkup() {
    const curPage = this._data.page
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    
    // Page 1, 有下一页
    if(curPage === 1 && numPages > 1) {
      return `
        <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `
    }

    // Page last
    if(curPage === numPages && numPages > 1) {
      return `
        <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
      `
    }

    // Other Page
    if(curPage < numPages) {
      return `
        <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
        
        <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `
    }

    // Page 1, 没有下一页
    return ''
  }
}

export default new PaginationView()