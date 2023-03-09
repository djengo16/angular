import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from 'app/recipes/models/recipe.model';
import { RecipeService } from 'app/recipes/services/recipe.service';
import { map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  private url: string =
    'https://ng-course-recipe-book-1cf48-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  saveRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.url, recipes).subscribe((response) => {
      console.log(response);
    });
  }

  fetchRecipes() {
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
