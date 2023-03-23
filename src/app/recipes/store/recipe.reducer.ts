import { Recipe } from '../models/recipe.model';
import * as RecipeActions from './recipe.actions';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [],
};

export function recipeReducer(
  state = initialState,
  action: RecipeActions.RecipeActions
) {
  switch (action.type) {
    case RecipeActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload],
      };
    case RecipeActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload],
      };

    case RecipeActions.EDIT_RECIPE:
      const recipe = state.recipes[action.payload.editedRecipeIndex];
      const editedRecipe = {
        ...recipe,
        ...action.payload.recipe,
      };
      const editedRecipes = [...state.recipes];
      editedRecipes[action.payload.editedRecipeIndex] = editedRecipe;
      return {
        ...state,
        recipes: editedRecipes,
      };
    case RecipeActions.REMOVE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter(
          (recipe, index) => index !== action.payload
        ),
      };
    default:
      return state;
  }
}
