import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';

const modules = [
  LoadingDialogComponent,
];

@NgModule({
  declarations: modules.slice(),
  entryComponents: modules.slice(),
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class DialogsModule { }
