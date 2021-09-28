import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EntitiesRoutingModule } from './entities-routing.module';
import { CentrosOperativosListComponent } from './centros-operativos-list/centros-operativos-list.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    CentrosOperativosListComponent
  ],
  imports: [
    CommonModule,
    EntitiesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
  ],
})
export class EntitiesModule { }
