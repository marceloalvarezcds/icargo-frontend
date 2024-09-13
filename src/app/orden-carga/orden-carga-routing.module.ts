import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { OrdenCargaCreateFormComponent } from './orden-carga-create-form/orden-carga-create-form.component';
import { OrdenCargaEditFormComponent } from './orden-carga-edit-form/orden-carga-edit-form.component';
import { OrdenCargaListComponent } from './orden-carga-list/orden-carga-list.component';
import { OrdenCargaNuevoAnticipoFormComponent } from './orden-carga-nuevo-anticipo-form/orden-carga-nuevo-anticipo-form.component';
import { OrdenCargaFormAceptarComponent } from './orden-carga-form-aceptar/orden-carga-form-aceptar.component';
import { OrdenCargaFinalizarFormComponent } from './orden-carga-finalizar-form/orden-carga-finalizar-form.component';
import { OrdenCargaRecepcionFormComponent } from './orden-carga-recepcion-form/orden-carga-recepcion-form.component';
import { OrdenCargaConciliarFormComponent } from './orden-carga-conciliar-form/orden-carga-conciliar-form.component';

const routes: Routes = [
  {
    path: m.ORDEN_CARGA,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      {
        path: a.LISTAR,
        component: OrdenCargaListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.CREAR}/:nuevo/:anticipo`,
        component: OrdenCargaNuevoAnticipoFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.CREAR}/:recepcion`,
        component: OrdenCargaRecepcionFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: OrdenCargaCreateFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.CREAR}/:aceptar/:oc/:nuevas`,
        component: OrdenCargaFormAceptarComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.CREAR}/:nuevo/:finalizar/:ocs/:aceptadas`,
        component: OrdenCargaFinalizarFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.CREAR}/:nuevo/:conciliar/:ocs/:concilacion/:final`,
        component: OrdenCargaConciliarFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: OrdenCargaEditFormComponent,
        canActivate: [PermisoGuard],
      },
     

      {
        path: `${a.VER}/:id`,
        component: OrdenCargaEditFormComponent,
        canActivate: [PermisoGuard],
      },
     
    
  
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdenCargaRoutingModule {}
