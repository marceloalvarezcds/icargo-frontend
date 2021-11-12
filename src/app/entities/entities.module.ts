import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EntitiesRoutingModule } from './entities-routing.module';
import { CentrosOperativosListComponent } from './centros-operativos-list/centros-operativos-list.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { CentrosOperativosFormComponent } from './centros-operativos-form/centros-operativos-form.component';
import { PipesModule } from '../pipes/pipes.module';
import { RemitenteListComponent } from './remitente-list/remitente-list.component';
import { DirectivesModule } from '../directives/directives.module';
import { RemitenteFormComponent } from './remitente-form/remitente-form.component';
import { GestorCargaListComponent } from './gestor-carga-list/gestor-carga-list.component';
import { GestorCargaFormComponent } from './gestor-carga-form/gestor-carga-form.component';
import { ProveedorListComponent } from './proveedor-list/proveedor-list.component';
import { ProveedorFormComponent } from './proveedor-form/proveedor-form.component';
import { PuntoVentaListComponent } from './punto-venta-list/punto-venta-list.component';
import { PuntoVentaFormComponent } from './punto-venta-form/punto-venta-form.component';


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
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    SharedModule,
  ],
})
export class EntitiesModule { }
