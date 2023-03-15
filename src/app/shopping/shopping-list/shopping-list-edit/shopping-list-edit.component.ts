import { OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Ingredient } from 'app/shared/ingredient.model';
import { Subscription } from 'rxjs';
import * as ShoppingListActions from '../../store/shopping-list.actions';
import * as fromShoppingList from '../../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css'],
})
export class ShoppingListEditComponent implements OnInit {
  @ViewChild('shoppingListForm') shoppingListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(
    private store: Store<fromShoppingList.AppState>
  ) {}

  ngOnInit(): void {
    this.subscription = this.store
      .select('shoppingList')
      .subscribe((stateData) => {
        if (stateData.editedIngredientIndex > -1) {
          console.log(stateData.editedIngredient);
          this.editMode = true;
          this.editedItem = stateData.editedIngredient;

          this.shoppingListForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount,
          });
        } else {
          this.editMode = false;
        }
      });
  }

  onAddIngrediant() {
    let newIngredient = this.getIngredientFromForm();
    this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));

    this.onFormClear();
  }

  onUpdateIngrediant() {
    const editedIngredient = this.getIngredientFromForm();
    console.log(editedIngredient);
    this.store.dispatch(
      new ShoppingListActions.UpdateIngredient(editedIngredient)
    );

    this.onFormClear();
  }

  onDeleteItem() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onFormClear();
  }

  onFormClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  getIngredientFromForm() {
    return new Ingredient(
      this.shoppingListForm.value.name,
      this.shoppingListForm.value.amount
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
