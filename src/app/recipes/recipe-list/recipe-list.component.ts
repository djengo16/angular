import { Component } from '@angular/core';
import { RecipeService } from 'app/recipes/services/recipe.service';
import { Recipe } from '../models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent {
  recipes: Recipe[] = [];
  constructor(private recipesService: RecipeService) {}

  ngOnInit() {
    this.recipes = this.recipesService.getRecipes();
  }
}
