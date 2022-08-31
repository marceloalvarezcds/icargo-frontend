import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CentrosOperativosFormComponent } from './centros-operativos-form/centros-operativos-form.component';
import { CentrosOperativosListComponent } from './centros-operativos-list/centros-operativos-list.component';
import { EntitiesRoutingModule } from './entities-routing.module';
import { GestorCargaFormComponent } from './gestor-carga-form/gestor-carga-form.component';
import { GestorCargaListComponent } from './gestor-carga-list/gestor-carga-list.component';
import { ProveedorFormComponent } from './proveedor-form/proveedor-form.component';
import { ProveedorListComponent } from './proveedor-list/proveedor-list.component';
import { PuntoVentaFormComponent } from './punto-venta-form/punto-venta-form.component';
import { PuntoVentaListComponent } from './punto-venta-list/punto-venta-list.component';
import { RemitenteFormComponent } from './remitente-form/remitente-form.component';
import { RemitenteListComponent } from './remitente-list/remitente-list.component';

@NgModule({
  declarations: [
    CentrosOperativosListComponent,
    CentrosOperativosFormComponent,
    RemitenteListComponent,
    RemitenteFormComponent,
    GestorCargaListComponent,
    GestorCargaFormComponent,
    ProveedorListComponent,
    ProveedorFormComponent,
    PuntoVentaListComponent,
    PuntoVentaFormComponent,
  ],
  imports: [
    CommonModule,
    EntitiesRoutingModule,
    DirectivesModule,
    FormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    SharedModule,
  ],
})
export class EntitiesModule {}
