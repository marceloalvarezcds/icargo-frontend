import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CentrosOperativosFormComponent } from './centros-operativos-form/centros-operativos-form.component';
import { CentrosOperativosListComponent } from './centros-operativos-list/centros-operativos-list.component';

const routes: Routes = [
  {
    path: 'centros-operativos/list',
    component: CentrosOperativosListComponent,
  },
  {
    path: 'centros-operativos/create',
    component: CentrosOperativosFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntitiesRoutingModule { }
