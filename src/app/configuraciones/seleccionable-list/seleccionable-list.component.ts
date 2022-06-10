import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { SeleccionableBaseModel } from 'src/app/interfaces/seleccionable';
import { TableEvent } from 'src/app/interfaces/table';
import { SeleccionableService } from 'src/app/services/seleccionable.service';

@Component({
  selector: 'app-seleccionable-list',
  templateUrl: './seleccionable-list.component.html',
  styleUrls: ['./seleccionable-list.component.scss'],
})
export class SeleccionableListComponent implements OnInit {
  modelo!: m;
  submodule!: string;
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: SeleccionableBaseModel) => element.id,
      sticky: true,
    },
    {
      def: 'descripcion',
      title: 'Nombre',
      value: (element: SeleccionableBaseModel) => element.descripcion,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: SeleccionableBaseModel) => element.estado,
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: SeleccionableBaseModel) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: SeleccionableBaseModel) => element.created_at,
      type: 'date',
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: SeleccionableBaseModel) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: SeleccionableBaseModel) => element.modified_at,
      type: 'date',
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  list: SeleccionableBaseModel[] = [];

  constructor(
    route: ActivatedRoute,
    private service: SeleccionableService,
    private router: Router
  ) {
    const { modelo, submodule } = route.snapshot.data;
    this.modelo = modelo;
    this.submodule = submodule;
    this.service.setEndpoint(modelo);
  }

  ngOnInit(): void {
    this.getList();
  }

  redirectToCreate(): void {
    this.router.navigate([`/config/${this.modelo}/${a.CREAR}`]);
  }

  redirectToEdit(event: TableEvent<SeleccionableBaseModel>): void {
    this.router.navigate([`/config/${this.modelo}/${a.EDITAR}`, event.row.id]);
  }

  redirectToShow(event: TableEvent<SeleccionableBaseModel>): void {
    this.router.navigate([`/config/${this.modelo}/${a.VER}`, event.row.id]);
  }

  private getList(): void {
    this.service.getList().subscribe((list) => {
      this.list = list;
    });
  }
}
