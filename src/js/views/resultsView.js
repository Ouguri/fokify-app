import View from './View.js';
import previewView from './previewView.js'
import icons from 'url:../../img/icons.svg'

// 显示搜索结果
class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = '搜索不到该食谱，请重新输入';
  _message = '';

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('')
  }

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('')
  }
}

export default new ResultView();