import View from './View.js';
import previewView from './previewView.js'
import icons from 'url:../../img/icons.svg'

// 显示搜索结果
class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = '还没有书签记录哦！';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler)
  }

  _generateMarkup() {
    return this._data.map(bookmark => previewView.render(bookmark, false)).join('')
  }
}

export default new BookmarkView();