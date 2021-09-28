import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CentrosOperativosListComponent } from './centros-operativos-list/centros-operativos-list.component';

const routes: Routes = [
  {
    path: 'centros-operativos/list',
    component: CentrosOperativosListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntitiesRoutingModule { }
