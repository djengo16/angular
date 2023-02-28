import { EventEmitter } from '@angular/core';
import { Recipe } from 'app/recipes/models/recipe.model';
import { Ingredient } from 'app/shared/ingredient.model';

export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();
  private recipes: Recipe[] = [
    new Recipe(
      'Shakshuka Recipe',
      'Shakshuka is a North African and Middle Eastern meal of poached eggs in a simmering tomato sauce.',
      'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2018/12/Shakshuka-19.jpg',
      [new Ingredient('Eggs', 4), new Ingredient('Tomato', 2)]
    ),
    new Recipe(
      'Easy Fluffy Pancakes',
      'These pancakes are light and fluffy and made entirely from scratch. They’re not too sweet and are very delicious',
      'https://www.inspiredtaste.net/wp-content/uploads/2022/11/Fluffy-Pancakes-Recipe-Video.jpg',
      [
        new Ingredient('Eggs', 4),
        new Ingredient('Milk', 3),
        new Ingredient('flour', 4),
      ]
    ),
  ];

  getRecipes() {
    return this.recipes.slice();
  }
  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
  }
  removeRecipe(recipe: Recipe) {
    let index = this.recipes.indexOf(recipe);
    this.recipes.splice(index);
  }
  editRecipe(recipe: Recipe) {
    let index = this.recipes.indexOf(recipe);
    this.recipes[index] = recipe;
  }
}
