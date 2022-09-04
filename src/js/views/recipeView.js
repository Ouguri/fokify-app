import View from './View.js';

import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = '找不到该食谱，请重新输入';
  _message = '';

  // 发布者-订阅者功能 --- 在视图模块监听，调用控制器
  addHandlerRender(handler) {
    // 监听哈希值改变
    const listenEvent = ['hashchange', 'load']
    listenEvent.forEach(ev => window.addEventListener(ev, handler))
  }

  // 因为已经有按钮在页面上了，我们没必要再创建一个 serving View 视图
  addHanderUpdateServings(handler) {
    this._parentElement.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn--update-servings');
      if(!btn) return
      
      const updateTo = +btn.dataset.updateTo; // 自定义数据属性要用驼峰在 js 显示

      if(updateTo === 0) return btn.dataset.updateTo = 1

      handler(updateTo);
    })
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn--round');
      if(!btn) return
      handler();  
    })
  }

  _generateMarkup() {
    return `
      <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1}">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings + 1}">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

            <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          <button class="btn--round btn--bookmark}">
            <svg class="">
              <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : '' }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    `;
  }

  _generateMarkupIngredient(ing) {
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${ing.quantity ? new Fraction(ing.quantity) : ''}</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>
      </li>
    `
  }
}

export default new RecipeView();