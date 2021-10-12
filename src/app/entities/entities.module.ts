import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EntitiesRoutingModule } from './entities-routing.module';
import { CentrosOperativosListComponent } from './centros-operativos-list/centros-operativos-list.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { CentrosOperativosFormComponent } from './centros-operativos-form/centros-operativos-form.component';
import { PipesModule } from '../pipes/pipes.module';
import { CentrosOperativosFormContactosComponent } from './centros-operativos-form-contactos/centros-operativos-form-contactos.component';


@NgModule({
  declarations: [
    CentrosOperativosListComponent,
    CentrosOperativosFormComponent,
    CentrosOperativosFormContactosComponent
  ],
  imports: [
    CommonModule,
    EntitiesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    SharedModule,
  ],
})
export class EntitiesModule { }
