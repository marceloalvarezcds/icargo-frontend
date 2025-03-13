import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Camion, CamionList } from 'src/app/interfaces/camion';
import { Column } from 'src/app/interfaces/column';
import { TableEvent } from 'src/app/interfaces/table';
import { CamionService } from 'src/app/services/camion.service';
import { DialogService } from 'src/app/services/dialog.service';
import { CamionFormDialogComponent } from '../camion-form-dialog/camion-form-dialog.component';
import { Propietario } from 'src/app/interfaces/propietario';
import { MatDialogRef } from '@angular/material/dialog';
import { CamionDialogData } from 'src/app/interfaces/camion-dialog-data';

@Component({
  selector: 'app-propietario-camion-list',
  templateUrl: './propietario-camion-list.component.html',
  styleUrls: ['./propietario-camion-list.component.scss'],
})
export class PropietarioCamionListComponent {
  a = PermisoAccionEnum;
  item?: Camion;
  camionList?: CamionList;
  pId?: number;
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: CamionList) => element.id,
      sticky: true,
    },
    {
      def: 'placa',
      title: 'Placa',
      value: (element: CamionList) => element.placa,
      sticky: true,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: CamionList) => element.estado,
    },
    {
      def: 'pais_emisor_placa_nombre',
      title: 'País Emisor',
      value: (element: CamionList) => element.pais_emisor_placa_nombre,
    },
    {
      def: 'tipo',
      title: 'Tipo de Camión',
      value: (element: CamionList) => element.tipo_descripcion,
    },
    {
      def: 'chofer_nombre',
      title: 'Chofer',
      value: (element: CamionList) => element.chofer_nombre,
    },
    {
      def: 'chofer_numero_documento',
      title: 'Documento Chofer',
      value: (element: CamionList) => element.chofer_numero_documento,
    },
    {
      def: 'marca',
      title: 'Marca',
      value: (element: CamionList) => element.marca_descripcion,
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  id?: number;
  list: CamionList[] = [];
  modelo = m.CAMION;
  cId?: number

  @Input() isShow = false;
  @Input() gestorCuentaId?: number;
  @Input() backUrl = `/flota/${m.CAMION}/${a.LISTAR}`;
  @Input() set propietarioId(id: number | undefined) {
    this.id = id;
    this.getList();
  }

  constructor(
    private camionService: CamionService,
    private dialog: DialogService,
    private router: Router,
    private cdr: ChangeDetectorRef,

  ) {}

  // ngOnInit(): void {
  //   if (this.id !== undefined) {
  //     this.camionService.getById(this.id).subscribe((data) => {
  //       this.item = data;
  //     },(error) => {

  //     });
  //   }
  // }

  redirectToCreate(): void {
    const dialogRef = this.dialog.open(CamionFormDialogComponent, {
      width: '1000px',
      data: {
        item: this.item,
        propietarioId: this.id,
      }
    });
    dialogRef.componentInstance.dataCamionSaved.subscribe(() => {
      this.getCamionPropietarioList(this.id!);
    });
  }

  redirectToEdit(event: TableEvent<CamionList>): void {
    this.item = this.list.find(i => i.id === event.row.id);
    if (this.item) {
      const dialogRef = this.dialog.open(CamionFormDialogComponent, {
        width: '1000px',
        data: {
          item: this.item,
          propietarioId: this.id,
          camionId: event.row.id,
          isEdit: true,
        }
      });
      dialogRef.componentInstance.dataCamionSaved.subscribe(() => {
        this.getCamionPropietarioList(this.id!);
      });
    }
  }

  redirectToShow(event: TableEvent<CamionList>): void {
    this.item = this.list.find(i => i.id === event.row.id);
    if (this.item) {
      const dialogRef = this.dialog.open(CamionFormDialogComponent, {
        width: '1000px',
        data: {
          item: this.item,
          propietarioId: this.id,
          camionId: event.row.id,
          isShow: true,
        }
      });
      dialogRef.componentInstance.dataCamionSaved.subscribe(() => {
        this.getCamionPropietarioList(this.id!);
      });
    }
  }

  deleteRow({ row }: TableEvent<CamionList>): void {
    const message = `¿Está seguro que desea eliminar el Camión con placa ${row.placa}?`;
    this.dialog.confirmationToDelete(
      message,
      this.camionService.delete(row.id),
      () => {
        this.getList();
      }
    );
  }

  private getList(): void {
    if (this.id) {
      this.camionService.getListByPropietarioId(this.id).subscribe((list) => {
        this.list = list;
      });
    }
  }

  private getCamionPropietarioList(cId: number): void {
    this.camionService.getListByPropietarioId(cId).subscribe(
      (list) => {

        this.list = list;

        if (this.list.length > 0) {
          this.item = this.list[0];

        }

        this.cdr.markForCheck();
      },
      (error) => {
        console.error('Error al obtener la lista de camiones:', error);
      }
    );
  }


}
