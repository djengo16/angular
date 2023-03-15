import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from 'app/shared/ingredient.model';
import { Observable, Subscription } from 'rxjs';
import { LoggingService } from 'app/logging.service';
import { Store } from '@ngrx/store';
import * as fromShoppingList from '../store/shopping-list.reducer';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(
    private loggingService: LoggingService,
    private store: Store<fromShoppingList.AppState>
  ) {}

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.ingredientsChangeSubscription =
    //   this.shoppingListService.ingredientsChanged.subscribe(
    //     (ingredients: Ingredient[]) => {
    //       this.ingredients = ingredients;
    //     }
    //   );

    this.loggingService.printLog('Hello from ShoppingListComponent ngOnInit!');
  }
  ngOnDestroy(): void {
    //this.ingredientsChangeSubscription.unsubscribe();
  }
  onEditItem(index) {
    //this.shoppingListService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
