import icons from 'url:../../img/icons.svg';
// 渲染结果的父类！

// 把整个类导出，因为它需要被继承，它不会被实例化
export default class View {
  _data;

  // 页面渲染的总函数
  //  JSDoc 注释
  /**
   * 将接收到的对象渲染到 dom
   * @param {Object | Object[]} data 被渲染的数据(e.g. recipe)
   * @param {boolean} [render=true] If false, 创建 markup 字符串，而非渲染到 dom  
   * @returns {undefined | string} 一个 markup string 或者没有
   * @this {Object} View instance
   * @author Ouguri
   * @todo 完成
   */
  render(data, render = true) {
    if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if(!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  update(data) {
    // if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    this._data = data;
    const newMarkup = this._generateMarkup();

    // 比较更新前后的 Markup，然后只更新变化了的部分

    // 将字符串 dom 转换成 dom 节点对象，变成了虚拟 dom 啊
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*')) // 把 newElements 全部元素选出, 这些变成了虚拟 dom
    const curElements = Array.from(this._parentElement.querySelectorAll('*'))

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // 比较 newEl 和 curEl 是否相同 用：isEqualNode，将比较每一个节点 node 是否相同
      // nodeValue：对于文本，可以获得对应的文本节点  firstChild: 会返回一个 node 节点
      // 在 newEL 中，文本在子注释里面 如 <span> 4 </span>  elmentnode 不是 textnode，这不一样
      // console.log(curEl, newEl.isEqualNode(curEl));

      // 只会在包含文本的元素上执行, 更新文本
      if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent
      }
      // 更新自定义属性的数字
      if(!newEl.isEqualNode(curEl)) {
        // console.log(Array.from(newEl.attributes));
       Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value))
      }
    })
  }

  _clear() {
    this._parentElement.innerHTML = ''
  }

  renderSpinner () {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message} 🎁</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message} 🎁</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }
}