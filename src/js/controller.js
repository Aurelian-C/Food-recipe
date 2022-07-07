import * as model from './model';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import recipeView from './views/recipeView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import errorQueryView from './views/errorQueryView';
import { TIMEOUT_MODAL, TIMEOUT_QUERY_MODAL } from './config';

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query.trim()) return resultsView.errorMessage();
    await model.getSearchResults(query);
    resultsView.render(model.pagination(1));
    paginationView.render(model.state.search);
  } catch (err) {
    errorQueryView.toggleModalVisibility();
    errorQueryView.errorMessage(err, model.queries);
  }
};

const controlSearchResultsError = async function (query) {
  try {
    resultsView.renderSpinner();
    await model.getSearchResults(query);
    resultsView.render(model.pagination(1));
    paginationView.render(model.state.search);

    setTimeout(() => {
      errorQueryView.toggleModalVisibility();
    }, TIMEOUT_QUERY_MODAL * 1000);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.pagination(goToPage));
  paginationView.render(model.state.search);
};

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id || id === 'results') return;
    recipeView.renderSpinner();
    await model.getRecipe(id);
    recipeView.render(model.state.recipe);
    resultsView.render(model.pagination());
    bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    console.log(err);
  }
};

const controlServings = function (newServing) {
  model.servings(newServing);
  recipeView.update(model.state.recipe);
};

const controlBookmarksNumber = function () {
  if (model.state.bookmarks.length >= 0) {
    bookmarksView.updateBookmarksNumber(model.state.bookmarks.length);
    bookmarksView.addBookmarksNumber();
  }

  if (!model.state.bookmarks.length) {
    bookmarksView.removeBookmarksNumber();
  }
};

const controlBookmarks = function () {
  !model.state.recipe.bookmarked
    ? model.addBookmark(model.state.recipe)
    : model.deleteBookmark(model.state.recipe.id);

  recipeView.render(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);

  controlBookmarksNumber();
};

const controlUploadRecipe = async function (formInputs) {
  try {
    await model.uploadRecipe(formInputs);
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);

    controlBookmarksNumber();

    setTimeout(() => {
      addRecipeView.toggleModalVisibility();
    }, TIMEOUT_MODAL * 1000);
  } catch (err) {
    console.log(err);
  }
};

const init = function () {
  searchView.addHandlerSubmit(controlSearchResults);
  paginationView.addHandlerPages(controlPagination);
  recipeView.addHandlerRecipe(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmarks(controlBookmarks);
  addRecipeView.addHandlerSubmit(controlUploadRecipe);
  errorQueryView.addHandlerResultsError(controlSearchResultsError);
};
init();
