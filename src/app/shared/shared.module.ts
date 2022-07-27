import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CheckboxFilterComponent } from './checkbox-filter/checkbox-filter.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { HeaderComponent } from './header/header.component';
import { HttpErrorSnackBarComponent } from './http-error-snack-bar/http-error-snack-bar.component';
import { KeyValueComponent } from './key-value/key-value.component';
import { PageFormAddressComponent } from './page-form-address/page-form-address.component';
import { PageFormAuditComponent } from './page-form-audit/page-form-audit.component';
import { PageFormContactosComponent } from './page-form-contactos/page-form-contactos.component';
import { PageFormEntitiesInfoComponent } from './page-form-entities-info/page-form-entities-info.component';
import { PageFormGeoComponent } from './page-form-geo/page-form-geo.component';
import { PageFormComponent } from './page-form/page-form.component';
import { PageComponent } from './page/page.component';
import { SearchableCheckboxFilterComponent } from './searchable-checkbox-filter/searchable-checkbox-filter.component';
import { SelectableItemTableComponent } from './selectable-item-table/selectable-item-table.component';
import { SelectableMovimientoTableComponent } from './selectable-movimiento-table/selectable-movimiento-table.component';
import { TablePaginatorComponent } from './table-paginator/table-paginator.component';
import { TableSelectorComponent } from './table-selector/table-selector.component';
import { TableComponent } from './table/table.component';

const modules = [
  HeaderComponent,
  CheckboxFilterComponent,
  GoogleMapComponent,
  HttpErrorSnackBarComponent,
  KeyValueComponent,
  PageComponent,
  PageFormAddressComponent,
  PageFormAuditComponent,
  PageFormComponent,
  PageFormGeoComponent,
  SearchableCheckboxFilterComponent,
  SelectableItemTableComponent,
  SelectableMovimientoTableComponent,
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
  ],
})
export class SharedModule {}
