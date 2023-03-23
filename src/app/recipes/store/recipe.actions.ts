import { Action } from '@ngrx/store';
import { Recipe } from '../models/recipe.model';

export const SET_RECIPES = '[Rcipes] Set Recipes';
export const GET_RECIPES = '[Recipes] Get Recipes';
export const ADD_RECIPE = '[Recipes] Add Recipe';
export const EDIT_RECIPE = '[Recipes] Edit Recipe';
export const REMOVE_RECIPE = '[Recipes] Remove Recipe';
export const STORE_RECIPES = '[Recipes] Store Recipes';

export class SetRecipes implements Action {
  readonly type = SET_RECIPES;
  constructor(public payload: Recipe[]) {}
}

export class GetRecipes implements Action {
  readonly type = GET_RECIPES;
}

export class AddRecipe implements Action {
  readonly type = ADD_RECIPE;
  constructor(public payload: Recipe) {}
}

export class EditRecipe implements Action {
  readonly type = EDIT_RECIPE;
  constructor(public payload: { editedRecipeIndex: number; recipe: Recipe }) {}
}

export class RemoveRecipe implements Action {
  readonly type = REMOVE_RECIPE;
  constructor(public payload: number) {}
}

export class StoreRecipes implements Action {
  readonly type = STORE_RECIPES;
}

export type RecipeActions =
  | SetRecipes
  | GetRecipes
  | AddRecipe
  | EditRecipe
  | RemoveRecipe
  | StoreRecipes;
