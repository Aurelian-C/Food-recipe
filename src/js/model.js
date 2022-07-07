import { API_KEY, API_URL, RES_PER_PAGE } from './config';
import { AJAX } from './helpers';

export const queries = [
  'carrot',
  'broccoli',
  'asparagus',
  'cauliflower',
  'corn',
  'cucumber',
  'green pepper',
  'lettuce',
  'mushrooms',
  'onion',
  'potato',
  'pumpkin',
  'red pepper',
  'tomato',
  'beetroot',
  'brussel sprouts',
  'peas',
  'zucchini',
  'radish',
  'sweet potato',
  'artichoke',
  'leek',
  'cabbage',
  'celery',
  'chili',
  'garlic',
  'basil',
  'coriander',
  'parsley',
  'dill',
  'rosemary',
  'oregano',
  'cinnamon',
  'saffron',
  'green bean',
  'bean',
  'chickpea',
  'lentil',
  'apple',
  'apricot',
  'avocado',
  'banana',
  'blackberry',
  'blackcurrant',
  'blueberry',
  'boysenberry',
  'cherry',
  'coconut',
  'fig',
  'grape',
  'grapefruit',
  'lemon',
  'lime',
  'lychee',
  'mandarin',
  'mango',
  'melon',
  'nectarine',
  'orange',
  'papaya',
  'passion fruit',
  'peach',
  'pear',
  'pineapple',
  'plum',
  'pomegranate',
  'quince',
  'raspberry',
  'strawberry',
  'watermelon',
  'salad',
  'pizza',
  'pasta',
  'popcorn',
  'lobster',
  'steak',
  'bbq',
  'pudding',
  'hamburger',
  'pie',
  'cake',
  'sausage',
  'tacos',
  'kebab',
  'poutine',
  'seafood',
  'chips',
  'fries',
  'masala',
  'paella',
  'som tam',
  'chicken',
  'toast',
  'tofu',
  'hummus',
  'maple syrup',
  'parma ham',
  'fajitas',
  'champ',
  'lasagna',
  'poke',
  'chocolate',
  'croissant',
  'arepas',
  'bunny chow',
  'pierogi',
  'donuts',
  'rendang',
  'sushi',
  'ice cream',
  'duck',
  'curry',
  'beef',
  'goat',
  'lamb',
  'turkey',
  'pork',
  'fish',
  'crab',
  'bacon',
  'ham',
  'pepperoni',
  'salami',
  'ribs',
];
queries.sort();

export const state = {
  recipe: {},
  search: {
    results: [],
    query: '',
    page: 1,
    res_per_page: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const getSearchResults = async function (query) {
  try {
    state.search.query = query;

    const results = await AJAX(`${API_URL}?search=${query}`);

    if (results.results === 0)
      throw new Error(
        `No result found for "${state.search.query}" query! You can click one of the query below:`
      );

    state.search.results = results.data.recipes.map(result => {
      return {
        id: result.id,
        image: result.image_url,
        publisher: result.publisher,
        title: result.title,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const pagination = function (page = state.search.page) {
  state.search.page = page;
  const startPage = (page - 1) * state.search.res_per_page;
  const endPage = page * state.search.res_per_page;
  return state.search.results.slice(startPage, endPage);
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  state.recipe = {
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    id: recipe.id,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    bookmarked: state.bookmarks.some(bookmark => bookmark.id === recipe.id)
      ? true
      : false,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const getRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}`);
    createRecipeObject(data);
  } catch (err) {
    throw err;
  }
};

export const servings = function (newServings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  state.bookmarks.some(bookmark => bookmark.id === recipe.id)
    ? ''
    : state.bookmarks.push(recipe);

  state.recipe.bookmarked = true;
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  state.recipe.bookmarked = false;
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const inputsEntries = Object.entries(newRecipe);

    const quantity = inputsEntries.filter(entry =>
      entry[0].startsWith('quantity')
    );

    const unit = inputsEntries.filter(entry => entry[0].startsWith('unit'));

    const description = inputsEntries.filter(entry =>
      entry[0].startsWith('description')
    );

    const arr = Array(quantity.length);
    arr.fill('a');
    const ingredients = arr
      .map((item, i) => {
        return {
          quantity: quantity[i][1] ? +quantity[i][1] : null,
          unit: unit[i][1],
          description: description[i][1],
        };
      })
      .filter(ing => ing.unit !== '' && ing.description !== '');

    console.log(ingredients);

    const recipe = {
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
      ingredients,
    };

    const response = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    createRecipeObject(response);

    addBookmark(state.recipe);
    state.recipe.bookmarked = true;
  } catch (err) {
    throw err;
  }
};
