import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorSnackBarComponent } from './http-error-snack-bar/http-error-snack-bar.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';

const modules = [
  HttpErrorSnackBarComponent
];

@NgModule({
  declarations: modules.slice(),
  exports: modules.slice(),
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ]
})
export class SharedModule { }
