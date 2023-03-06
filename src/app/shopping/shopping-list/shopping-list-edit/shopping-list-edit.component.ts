import { OnInit, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Ingredient } from 'app/shared/ingredient.model';
import { ShoppingListService } from 'app/shopping/services/shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css'],
})
export class ShoppingListEditComponent implements OnInit {
  @ViewChild('shoppingListForm') shoppingListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onAddIngrediant() {
    let newIngredient = this.getIngredientFromForm();
    this.shoppingListService.addIngredient(newIngredient);
    this.onFormClear();
  }

  onUpdateIngrediant() {
    this.shoppingListService.updateIngredient(
      this.editedItemIndex,
      this.getIngredientFromForm()
    );
    this.onFormClear();
  }

  onDeleteItem() {
    this.shoppingListService.removeIngredient(this.editedItemIndex);
    this.onFormClear();
  }

  onFormClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
  }

  getIngredientFromForm() {
    return new Ingredient(
      this.shoppingListForm.value.name,
      this.shoppingListForm.value.amount
    );
  }
}
