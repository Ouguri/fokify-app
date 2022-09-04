// 分页器
import View from './View.js';
import icons from 'url:../../img/icons.svg'

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload'); // 输入框父元素
  _message = '菜谱已经被成功添加！'
  
  _window = document.querySelector('.add-recipe-window'); // 模态框
  _overlay = document.querySelector('.overlay'); // 遮罩
  _btnOpen = document.querySelector('.nav__btn--add-recipe'); // 按钮的元素
  _btnClose = document.querySelector('.btn--close-modal'); // 关闭按钮的元素

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow()
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this))
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this))
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function(e) {
      e.preventDefault();
      // FormData() 构造函数里面传入一个表单元素
      const dataArr = [...new FormData(this)]
      // Es2019 有一种新方法将 array 转换为对象
      // 注意，本方法需要的 ['title', 'test'] 这样类型的数组，变成对象
      const data = Object.fromEntries(dataArr) // 该方法和 entries 方法相反
      handler(data)
    })
  }

  _generateMarkup() {

  }
}

export default new AddRecipeView()