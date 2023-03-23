import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from 'app/recipes/models/recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
})
export class RecipeItemComponent implements OnInit {
  @Input('recipe') recipe: Recipe;
  @Input('recipeIndex') recipeIndex: number;
  constructor() {}

  ngOnInit() {}
}
