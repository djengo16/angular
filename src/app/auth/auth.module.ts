import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { AuthComponent } from './auth.component';
import { NonAuthGuard } from './non-auth.guard';

const authRoutes: Routes = [
  { path: '', component: AuthComponent, canActivate: [NonAuthGuard] },
];

@NgModule({
  declarations: [AuthComponent],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild(authRoutes),
  ],
})
export class AuthModule {}
