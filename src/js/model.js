import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

// 整个模型的一个大文件, 如食谱、搜索、书签等模块
// 将对象导出一边 controller.js 可以控制
export const state = {
  recipe: {}, // 当前显示的配方
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1
  },
  bookmarks: []
};

const createRecipeObject = function(data) {
  const { recipe } = data.data
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // 这里用了末端运算符短路( && )
    // 如果 recipe.key 是一个错误的值，或者不存在，那么这里什么也没有发生
    // 如果存在 {key: recipe.key} 这一部分被执行并返回
    ...(recipe.key && {key: recipe.key})
  }
}

// 该函数负责用于实际获取 recipe 数据从 API
export const loadRecipe = async function(id) {
   try {
      const data = await AJAX(`${ API_URL }${id}?key=${KEY}`)
      state.recipe = createRecipeObject(data)

      if(state.bookmarks.some(bookmark => bookmark.id === id))
        state.recipe.bookmarked = true
      else state.recipe.bookmarked = false

   } catch (err) {
      console.error(`${err} 🎁`) // 临时错误处理
      // 抛出错误，向下传播到 controlRecipes
      throw err;
   }
}

// 搜索
export const loadSearchResults = async function(query) {
  try {
    state.search.query = query
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)
    
    // 返回一个包含新对象的新数组
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key: rec.key})
      }
    })
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 🎁`) // 临时错误处理
    // 抛出错误，向下传播到 controlRecipes
    throw err;
  }
}

export const getSearchResultsPage = function(page = state.search.page) {
  state.search.page = page

  const start = (page - 1) * state.search.resultsPerPage // 0;
  const end =  page * state.search.resultsPerPage // 9;

  return state.search.results.slice(start, end);
}

// servings 份数， 菜品德份数
export const updateServings = function(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * newServings / state.recipe.servings;
    // newQt = oldQt * newServing / oldServings // 2 * 8 / 4 = 4
  })

  state.recipe.servings = newServings;
}

const persistBookmarks = function() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function(recipe) {
  // 添加书签
  state.bookmarks.push(recipe);
  // 将当前食谱标记为书签
  if(recipe.id === state.recipe.id) state.recipe.bookmarked = true

  persistBookmarks()
}

export const deleteBookmark = function(id) {
  // 删除书签
  const index = state.bookmarks.findIndex(el => el.id === id)
  console.log(index);
  state.bookmarks.splice(index, 1)
  // 将当前食谱标记为书签
  if(id === state.recipe.id) state.recipe.bookmarked = false

  persistBookmarks()
}

const init = function() {
  const storage = localStorage.getItem('bookmarks');
  if(storage) state.bookmarks = JSON.parse(storage)
}
init();

const clearBookmarks = function() {
  localStorage.clear('bookmarks')
}

export const uploadRecipe = async function(newRecipe) {
  try {
      // console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe).filter(entry => 
      // 过滤出第一个元素开头是ingredient，第二个元素不为空的数组项
      entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {
      // const ingArr = ing[1].replaceAll(' ', '').split(',');
      // 清除空格间距
      const ingArr = ing[1].split(',').map(el => el.trim());

      if(ingArr.length !== 3) throw new Error('错误的成分格式！请使用正确的格式')
      const [quantity, unit, description] = ingArr;
      return {quantity: quantity ? +quantity : null, unit, description}
      // {quantity: '0.5', unit: 'kg', description: 'Rice'}
    });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    }

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe)

    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}
/* 
  这里说明一下当本地存储书签然后重载页面报错 textcontent 什么什么的原因：（当然现在已经解决了，通过监听页面重载先渲染书签历史再更新页面的方法）
    当本地存储成立，本地存储有了我们的书签，菜谱对象信息
    当我们重新进入页面，上面的 init() 函数将执行，提取本地存储数据并保存到 state.bookmarks
    然后页面将加载，conrtoller 文件的控制页面重载方法 controlRecipes 中的 bookmarksView.update(model.state.bookmarks)
    将被执行，在我们的 update 方法中，通过比对当前页面元素和要更新页面所准备的新一套当前页面元素的不同点来进行定点更新
    记得 state.bookmarks 已经存在数据， 所以新的一套虚拟 dom 中 将会有书签历史的 dom 元素
    而当前页面是不存在书签历史的，所以书签历史的 dom 元素不存在
    然后经过两者 Array.from 转化成数组同时循环，长度将是不一样的，虚拟 dom 的书签历史的文本无法定点更新到不存在的书签历史上
    注意我这里说的是文本而不是整个元素！所以页面将会报错，因为如此书签历史上的菜谱的 id ？ 也无法被选中。菜谱无法出现
    我只能这样说了。。。
*/