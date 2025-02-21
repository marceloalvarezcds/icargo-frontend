import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { InsumoListComponent } from './insumo-list/insumo-list.component';
import { InsumoRoutingModule } from './insumo-routing.module';
import { InsumoVentaPrecioFormComponent } from './insumo-venta-precio-form/insumo-venta-precio-form.component';
import { CreateInsmunoVentaPrecioFormComponent } from './create-insmuno-venta-precio-form/create-insmuno-venta-precio-form.component';



@NgModule({
  declarations: [
  InsumoListComponent,
  InsumoVentaPrecioFormComponent,
  CreateInsmunoVentaPrecioFormComponent,
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    InsumoRoutingModule,
    FormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    SharedModule,
  ]
})
export class InsumoModule { }
