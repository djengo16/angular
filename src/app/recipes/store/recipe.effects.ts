import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { Recipe } from '../models/recipe.model';

import * as fromApp from '../../store/app.reducer';

import * as RecipesActions from '../store/recipe.actions';

@Injectable()
export class RecipeEffects {
  private url: string =
    'https://ng-course-recipe-book-1cf48-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';

  fetchRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.GET_RECIPES),
      switchMap(() => {
        return this.http.get<Recipe[]>(this.url);
      }),
      map((recipes) => {
        return recipes.map((recipe) => {
          if (!recipe['ingredients']) {
            recipe['ingredients'] = [];
          }
          return recipe;
        });
      }),
      map((recipes) => {
        return new RecipesActions.SetRecipes(recipes);
      })
    )
  );

  storeRecipes = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
          return this.http.put(this.url, recipesState.recipes);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
