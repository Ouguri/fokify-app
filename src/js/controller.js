import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // 补充其他给 es5
import 'regenerator-runtime/runtime' // 补充async / await 给 es5
import { async } from 'regenerator-runtime';

// if(module.hot) {
//   module.hot.accept()
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);

    if(!id) return;

    // 更新点击选择的配方高亮
    resultsView.update(model.getSearchResultsPage())

    // 更新书签历史列表状态的高亮状态，选中的菜谱高亮
    bookmarksView.update(model.state.bookmarks)
    
    // 等待加载动画
    recipeView.renderSpinner(); 
    
    // 加载菜谱
    await model.loadRecipe(id);
    
    // 渲染菜谱
    recipeView.render(model.state.recipe)

    
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }

}

const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();

    // 1. 拿到搜索数据
    const query = searchView.getQuery();
    if(!query) return;

    // 2. 等待搜索结果
    await model.loadSearchResults(query)

    // 3. 渲染结果
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage())

    // 4. 渲染分页器
    paginationView.render(model.state.search)
  } catch(err) {
    // 这里搜索不到返回的结果是空数组，没造成错误，所以这里是捕捉不到的，只能在渲染函数判断
    console.error(err);
  }
}

const controlPagination = function(goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage))
  paginationView.render(model.state.search)
}

// 更新食谱
const controlServings = function(newServings) {
  // 更新菜谱服务 (in state)
  model.updateServings(newServings);

  // 更新 recipe view
  // recipeView.render(model.state.recipe);
  // 我们希望局部更新 该方法只会更新文字不会更新图片
  recipeView.update(model.state.recipe);

}

const controlAddBookmark = function() {
  // add/remove 书签
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)
  // 局部更新书签标志
  recipeView.update(model.state.recipe);
  // 渲染书签列表
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe) {
  try {
    // 加载图标
    addRecipeView.renderSpinner();

    // 上传新的菜谱
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // 渲染菜谱
    recipeView.render(model.state.recipe)

    // 成功消息显示
    addRecipeView.renderMessage();

    // 渲染书签历史 我们想插入一个书签而不是更新他
    bookmarksView.render(model.state.bookmarks);

    // 改变 id: url 地址
    // pushState 接受三个参数 state(状态) title(标题) url, 还可以让页面前进后退
    window.history.pushState(null, '', `#${model.state.recipe.id}`); // 该浏览器内置方法可以让我们不刷新页面更新地址
    // window.history.back() 还可以让页面前进后退

    // 关闭表单窗口
    setTimeout(function() {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    console.error('🧧', err);
    addRecipeView.renderError(err.message)
  }
}

const newFeature = function() {
  console.log('Welcome to the application');
}

// 发布者-订阅者功能，在此调用 controlRecipes 作为 addHandlerRender 参数，并在视图区调用该函数(controlRecipes)作为回调函数
const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks); // 当页面重载触发渲染书签历史的列表内容
  recipeView.addHandlerRender(controlRecipes); // 当地址哈希值改变时触发
  recipeView.addHanderUpdateServings(controlServings); // 当做菜份数改变时触发
  recipeView.addHandlerAddBookmark(controlAddBookmark); // 当书签被添加或删除时触发
  searchView.addHandlerSearch(controlSearchResults); // 当搜索结果提交时触发
  paginationView.addHandlerClick(controlPagination); // 当翻页按钮被点击时触发
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature()
}
init();


