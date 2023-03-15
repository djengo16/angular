import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoggingService } from 'app/logging.service';
import { AlertComponent } from './alert/alert.component';
import { DropdownDirective } from './directives/dropdown.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [AlertComponent, LoadingSpinnerComponent, DropdownDirective],
  imports: [CommonModule],
  exports: [AlertComponent, LoadingSpinnerComponent, DropdownDirective],
  providers: [LoggingService],
})
export class SharedModule {}
