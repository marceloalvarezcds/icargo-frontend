import { Component, OnInit } from '@angular/core';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { SeleccionableBaseModel } from 'src/app/interfaces/seleccionable';
import { SeleccionableRouteData } from 'src/app/interfaces/seleccionable-form-dialog-data';
import { TableEvent } from 'src/app/interfaces/table';
import { ActivatedRouteService } from 'src/app/services/activated-route.service';
import { SeleccionableListService } from './seleccionable-list.service';

@Component({
  selector: 'app-seleccionable-list',
  templateUrl: './seleccionable-list.component.html',
  styleUrls: ['./seleccionable-list.component.scss'],
  providers: [SeleccionableListService],
})
export class SeleccionableListComponent<DialogComponent, DialogData>
  implements OnInit
{
  get modelo(): m {
    return this.service.modelo;
  }

  get submodule(): string {
    return this.service.submodule;
  }

  get columns(): Column[] {
    return this.service.columns;
  }

  get list(): SeleccionableBaseModel[] {
    return this.service.list;
  }

  constructor(
    route: ActivatedRouteService,
    private service: SeleccionableListService<DialogComponent, DialogData>
  ) {
    this.service.setRouteData(
      route.snapshot.data as SeleccionableRouteData<DialogComponent, DialogData>
    );
  }

  ngOnInit(): void {
    this.service.getList();
  }

  create(): void {
    this.service.create();
  }

  edit({ row }: TableEvent<SeleccionableBaseModel>): void {
    this.service.edit(row);
  }

  active({ row }: TableEvent<SeleccionableBaseModel>): void {
    this.service.active(row);
  }

  inactive({ row }: TableEvent<SeleccionableBaseModel>): void {
    this.service.inactive(row);
  }
}
