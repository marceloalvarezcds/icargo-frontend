import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { HttpErrorSnackBarComponent } from './http-error-snack-bar/http-error-snack-bar.component';
import { HeaderComponent } from './header/header.component';
import { CheckboxFilterComponent } from './checkbox-filter/checkbox-filter.component';
import { PageComponent } from './page/page.component';
import { PageFormComponent } from './page-form/page-form.component';
import { TableComponent } from './table/table.component';
import { SearchableCheckboxFilterComponent } from './searchable-checkbox-filter/searchable-checkbox-filter.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { TablePaginatorComponent } from './table-paginator/table-paginator.component';
import { TableSelectorComponent } from './table-selector/table-selector.component';
import { PageFormGeoComponent } from './page-form-geo/page-form-geo.component';
import { PageFormContactosComponent } from './page-form-contactos/page-form-contactos.component';
import { PageFormEntitiesInfoComponent } from './page-form-entities-info/page-form-entities-info.component';
import { PageFormAddressComponent } from './page-form-address/page-form-address.component';
import { PageFormAuditComponent } from './page-form-audit/page-form-audit.component';

const modules = [
  HeaderComponent,
  CheckboxFilterComponent,
  GoogleMapComponent,
  HttpErrorSnackBarComponent,
  PageComponent,
  PageFormAddressComponent,
  PageFormAuditComponent,
  PageFormComponent,
  PageFormGeoComponent,
  SearchableCheckboxFilterComponent,
  TableComponent,
  TablePaginatorComponent,
  TableSelectorComponent,
  PageFormContactosComponent,
  PageFormEntitiesInfoComponent,
];

@NgModule({
  declarations: modules.slice(),
  exports: modules.slice(),
  imports: [
    CommonModule,
    GoogleMapsModule,
    FormFieldModule,
    FormsModule,
    MaterialModule,
    PipesModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class SharedModule { }
