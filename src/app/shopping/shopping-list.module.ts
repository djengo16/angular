import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LoggingService } from 'app/logging.service';
import { ShoppingListEditComponent } from './shopping-list/shopping-list-edit/shopping-list-edit.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

const shoppingRoutes: Routes = [
  {
    path: '',
    component: ShoppingListComponent,
  },
];

@NgModule({
  declarations: [ShoppingListComponent, ShoppingListEditComponent],
  imports: [RouterModule.forChild(shoppingRoutes), CommonModule, FormsModule],
  //providers: [LoggingService],
})
export class ShoppingListModule {}
