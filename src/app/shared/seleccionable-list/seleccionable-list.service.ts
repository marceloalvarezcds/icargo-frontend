import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { SeleccionableBaseModel } from 'src/app/interfaces/seleccionable';
import { SeleccionableRouteData } from 'src/app/interfaces/seleccionable-form-dialog-data';
import { DialogService } from 'src/app/services/dialog.service';
import { SeleccionableService } from 'src/app/services/seleccionable.service';
import { create, edit } from 'src/app/utils/table-event-crud';

@Injectable({
  providedIn: 'root',
})
export class SeleccionableListService<DialogComponent, DialogData> {
  modelo!: m;
  submodule!: string;
  private changeStatusMsg!: string;
  private dialogComponent!: ComponentType<DialogComponent>;
  private getDialogData?: (item?: SeleccionableBaseModel) => DialogData;

  private cols: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: SeleccionableBaseModel) => element.id,
      sticky: true,
    },
    {
      def: 'descripcion',
      title: 'Descripción',
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

  private lista: SeleccionableBaseModel[] = [];

  get columns(): Column[] {
    return this.cols;
  }

  get list(): SeleccionableBaseModel[] {
    return this.lista;
  }

  constructor(
    private dialog: DialogService,
    private service: SeleccionableService<SeleccionableBaseModel>
  ) {}

  setRouteData(
    data: SeleccionableRouteData<DialogComponent, DialogData>
  ): void {
    const {
      modelo,
      submodule,
      changeStatusMsg,
      dialogComponent,
      getDialogData,
    } = data;
    this.modelo = modelo;
    this.submodule = submodule;
    this.changeStatusMsg = changeStatusMsg;
    this.dialogComponent = dialogComponent;
    this.getDialogData = getDialogData;
    this.service.setEndpoint(modelo);
  }

  getList(): void {
    this.service.getList().subscribe((list) => {
      this.lista = list;
    });
  }

  create(): void {
    create(this.getDialogRef(), this.getList.bind(this));
  }

  edit(item: SeleccionableBaseModel): void {
    edit(this.getDialogRef(item), this.getList.bind(this));
  }

  active(item: SeleccionableBaseModel): void {
    this.dialog.changeStatusConfirm(
      this.changeStatusMessage(item, 'activar'),
      this.service.active(item.id),
      () => {
        this.getList();
      }
    );
  }

  inactive(item: SeleccionableBaseModel): void {
    this.dialog.changeStatusConfirm(
      this.changeStatusMessage(item, 'desactivar'),
      this.service.inactive(item.id),
      () => {
        this.getList();
      }
    );
  }

  private getDialogRef(
    item?: SeleccionableBaseModel
  ): MatDialogRef<DialogComponent, DialogData> {
    const data: DialogData | null = this.getDialogData
      ? this.getDialogData(item)
      : null;
    return this.dialog.open(this.dialogComponent, { data });
  }

  private changeStatusMessage(
    row: SeleccionableBaseModel,
    accion: string
  ): string {
    return `¿Está seguro que desea ${accion} ${this.changeStatusMsg} Nº ${row.id}?`;
  }
}
