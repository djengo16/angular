import { ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component } from '@angular/core';
import { Ingredient } from 'app/shared/ingredient.model';
import { ShoppingListService } from 'app/shopping/services/shopping-list.service';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css'],
})
export class ShoppingListEditComponent {
  @ViewChild('nameInput', { static: true }) nameRef: ElementRef;
  @ViewChild('amountInput', { static: true }) amountRef: ElementRef;

  constructor(private shoppingListService: ShoppingListService) {}

  onAddIngrediant() {
    let newIngredient = new Ingredient(
      this.nameRef.nativeElement.value,
      this.amountRef.nativeElement.value
    );

    this.shoppingListService.addIngredient(newIngredient);
  }
}
