import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorSnackBarComponent } from './http-error-snack-bar/http-error-snack-bar.component';
import { MaterialModule } from '../material/material.module';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxFilterComponent } from './checkbox-filter/checkbox-filter.component';
import { PageComponent } from './page/page.component';
import { TableComponent } from './table/table.component';
import { SearchableCheckboxFilterComponent } from './searchable-checkbox-filter/searchable-checkbox-filter.component';

const modules = [
  HeaderComponent,
  CheckboxFilterComponent,
  HttpErrorSnackBarComponent,
  PageComponent,
  SearchableCheckboxFilterComponent,
  TableComponent,
];

@NgModule({
  declarations: modules.slice(),
  exports: modules.slice(),
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class SharedModule { }
