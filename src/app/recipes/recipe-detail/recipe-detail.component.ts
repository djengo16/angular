import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { Ingredient } from 'app/shared/ingredient.model';
import { ShoppingListService } from 'app/shopping/services/shopping-list.service';
import { Recipe } from '../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent {
  @Input() recipe: Recipe;

  constructor(private shoppingListService: ShoppingListService) {}

  onAddIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
