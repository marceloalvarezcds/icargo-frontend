import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { HttpErrorSnackBarComponent } from './http-error-snack-bar/http-error-snack-bar.component';
import { HeaderComponent } from './header/header.component';
import { CheckboxFilterComponent } from './checkbox-filter/checkbox-filter.component';
import { PageComponent } from './page/page.component';
import { PageFormComponent } from './page-form/page-form.component';
import { TableComponent } from './table/table.component';
import { SearchableCheckboxFilterComponent } from './searchable-checkbox-filter/searchable-checkbox-filter.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { TablePaginatorComponent } from './table-paginator/table-paginator.component';
import { PageFormGeoComponent } from './page-form-geo/page-form-geo.component';

const modules = [
  HeaderComponent,
  CheckboxFilterComponent,
  GoogleMapComponent,
  HttpErrorSnackBarComponent,
  PageComponent,
  PageFormComponent,
  PageFormGeoComponent,
  SearchableCheckboxFilterComponent,
  TableComponent,
  TablePaginatorComponent,
];

@NgModule({
  declarations: modules.slice(),
  exports: modules.slice(),
  imports: [
    CommonModule,
    GoogleMapsModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class SharedModule { }
