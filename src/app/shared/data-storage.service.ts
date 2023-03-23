import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from 'app/recipes/models/recipe.model';
import { map, tap } from 'rxjs';
import { Store } from '@ngrx/store';

import * as RecipeActions from '../recipes/store/recipe.actions';
import * as fromApp from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  private url: string =
    'https://ng-course-recipe-book-1cf48-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';
  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  saveRecipes() {
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  fetchRecipes() {
    /**
     * Returns one overall observable out of two. The first part takes the
     * latest emitted value (only 1), from the user change. We use exhaustMap
     * to replace the first observable aka the user when its returned with
     * the http.get observable. This way we can use the result from the
     * first observable in the second one as we do below. We get the
     * user token and append it to the url. Since we are in the pipe
     * we can use operators like map and tap to modify the response data.
     */
    //   return this.authService.user.pipe(
    //     take(1),
    //     exhaustMap((user) => {
    //       return this.http.get<Recipe[]>(this.url, {
    //         params: new HttpParams().set('auth', user.token),
    //       });
    //     }),
    //     map((recipes) => {
    //       return recipes.map((recipe) => {
    //         if (!recipe['ingredients']) {
    //           recipe['ingredients'] = [];
    //         }
    //         return recipe;
    //       });
    //     }),
    //     tap((recipesResponse) => {
    //       this.recipeService.setRecipes(recipesResponse);
    //     })
    //   );
    // }

    return this.http.get<Recipe[]>(this.url).pipe(
      map((recipes) => {
        return recipes.map((recipe) => {
          if (!recipe['ingredients']) {
            recipe['ingredients'] = [];
          }
          return recipe;
        });
      }),
      tap((recipesResponse) => {
        this.store.dispatch(new RecipeActions.SetRecipes(recipesResponse));
      })
    );
  }
}
