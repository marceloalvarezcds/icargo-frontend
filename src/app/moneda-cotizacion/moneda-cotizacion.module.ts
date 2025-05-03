import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MonedaCotizacionRoutingModule } from './moneda-cotizacion-routing.module';
import { MonedaCotizacionFormComponent } from './moneda-cotizacion-form/moneda-cotizacion-form.component';
import { MonedaCotizacionListComponent } from './moneda-cotizacion-list/moneda-cotizacion-list.component';


@NgModule({
  declarations: [
    MonedaCotizacionFormComponent,
    MonedaCotizacionListComponent,
  ],
  imports: [
    CommonModule,
    MonedaCotizacionRoutingModule,
    FormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    SharedModule,
  ]
})
export class MonedaCotizacionModule { }
