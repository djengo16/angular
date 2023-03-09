import { Component, EventEmitter, Output } from '@angular/core';
import { DataStorageService } from 'app/shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  collapsed = true;
  constructor(private dataStorage: DataStorageService) {}

  onSaveData() {
    this.dataStorage.saveRecipes();
  }
  onFetchData() {
    this.dataStorage.fetchRecipes().subscribe();
  }
}
