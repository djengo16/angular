import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Recipe } from 'app/recipes/models/recipe.model';
import { RecipeService } from 'app/recipes/services/recipe.service';
import { exhaustMap, map, take, tap } from 'rxjs';
import { AuthService } from 'app/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  private url: string =
    'https://ng-course-recipe-book-1cf48-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  saveRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.url, recipes).subscribe((response) => {});
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
        this.recipeService.setRecipes(recipesResponse);
      })
    );
  }
}
