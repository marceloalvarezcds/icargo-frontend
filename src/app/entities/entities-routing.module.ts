import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CentrosOperativosFormComponent } from './centros-operativos-form/centros-operativos-form.component';
import { CentrosOperativosListComponent } from './centros-operativos-list/centros-operativos-list.component';
import { GestorCargaFormComponent } from './gestor-carga-form/gestor-carga-form.component';
import { GestorCargaListComponent } from './gestor-carga-list/gestor-carga-list.component';
import { RemitenteFormComponent } from './remitente-form/remitente-form.component';
import { RemitenteListComponent } from './remitente-list/remitente-list.component';

const routes: Routes = [
  {
    path: 'centros-operativos/list',
    component: CentrosOperativosListComponent,
  },
  {
    path: 'centros-operativos/create',
    component: CentrosOperativosFormComponent,
  },
  {
    path: 'centros-operativos/edit/:id',
    component: CentrosOperativosFormComponent,
  },
  {
    path: 'centros-operativos/show/:id',
    component: CentrosOperativosFormComponent,
  },
  {
    path: 'gestor-carga/list',
    component: GestorCargaListComponent,
  },
  {
    path: 'gestor-carga/create',
    component: GestorCargaFormComponent,
  },
  {
    path: 'gestor-carga/edit/:id',
    component: GestorCargaFormComponent,
  },
  {
    path: 'gestor-carga/show/:id',
    component: GestorCargaFormComponent,
  },
  {
    path: 'remitente/list',
    component: RemitenteListComponent,
  },
  {
    path: 'remitente/create',
    component: RemitenteFormComponent,
  },
  {
    path: 'remitente/edit/:id',
    component: RemitenteFormComponent,
  },
  {
    path: 'remitente/show/:id',
    component: RemitenteFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntitiesRoutingModule { }
