import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Ingredient } from 'app/shared/ingredient.model';
import { ShoppingListService } from 'app/shopping/services/shopping-list.service';
import { Subscription } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent {
  recipe: Recipe;
  recipeSubscription: Subscription;
  constructor(
    private shoppingListService: ShoppingListService,
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    // this.recipe = this.recipeService.getRecipeById(
    //   this.route.snapshot.params['id']
    // );
    this.route.params.subscribe((params: Params) => {
      this.recipe = this.recipeService.getRecipeById(params['id']);
    });
  }

  onAddIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
