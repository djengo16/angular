import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  collapsed = true;

  navigation = {
    recipes: 'recipes',
    shoppingList: 'shopping-list',
  };
  @Output() featureSelected = new EventEmitter<string>();

  constructor() {
    this.featureSelected.emit(this.navigation.recipes);
  }

  onSelect(navigationValue: string) {
    this.featureSelected.emit(navigationValue);
  }
}
