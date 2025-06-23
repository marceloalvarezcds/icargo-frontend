import { ComponentType } from '@angular/cdk/portal';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { OcAnticipoRetiradoEfectivoAnulacionDialogComponent } from 'src/app/dialogs/oc-anticipo-retirado-efectivo-anulacion-dialog/oc-anticipo-retirado-efectivo-anulacion-dialog.component';
import { OcAnticipoRetiradoInsumoAnulacionDialogComponent } from 'src/app/dialogs/oc-anticipo-retirado-insumo-anulacion-dialog/oc-anticipo-retirado-insumo-anulacion-dialog.component';
import { RemisionFormDialogComponent } from 'src/app/dialogs/remision-form-dialog/remision-form-dialog.component';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { ButtonList } from 'src/app/interfaces/buttonList';
import { Column } from 'src/app/interfaces/column';
import { OcAnticipoRetiradoDialogData, OcAnticipoRetiradoListDialogData, OcAnticipoRetiradoTestDialogData } from 'src/app/interfaces/oc-anticipo-retirado-dialog-data';
import { OrdenCarga, OrdenCargaList } from 'src/app/interfaces/orden-carga';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import { TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { OrdenCargaAnticipoRetiradoService } from 'src/app/services/orden-carga-anticipo-retirado.service';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';
import { edit } from 'src/app/utils/table-event-crud';

type Filter = {
  proveedor?: string;
  establecimiento?: string;
  mercaderia?: string;
};

@Component({
  selector: 'app-orden-carga-anticipos-list',
  templateUrl: './orden-carga-anticipos-list.component.html',
  styleUrls: ['./orden-carga-anticipos-list.component.scss']
})
export class OrdenCargaAnticiposListComponent implements OnInit {

  modelo = m.ORDEN_CARGA_ANTICIPO_RETIRADO;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: OrdenCargaAnticipoRetirado) => element.id,
    },
    {
      def: 'pdf',
      title: 'PDF',
      type: 'button',
      value: () => 'PDF',
      buttonCallback: (element: OrdenCargaAnticipoRetirado) =>
        this.downloadPDF(element),
    },
    {
      def: 'estado_movimiento_propietarioetarioopietario',
      title: 'Estado',
      value: (element: OrdenCargaAnticipoRetirado) => element.estado_movimiento_propietario?.toUpperCase(),
      dinamicStyles: (element: OrdenCargaAnticipoRetirado) => {
        switch (element.estado_movimiento_propietario) {
          case 'Activo':
          case 'Aceptado':
          case 'En Revisión':
            return { color: '#008000' };
          case 'Conciliado':
            return { color: '#9747FF' };
          case 'Finalizado':
            return { color: '#89969F' };
          case 'Inactivo':
            return { color: '#FF0000' };
          case 'Pendiente':
            return { color: '#FFA500' };
          case 'Provision':
            return { color: 'gray' };
          case 'Anulado':
            return { color: 'red' };
          case 'Saldo abierto':
            return { color: '#9747FF' };
          case 'Saldo cerrado':
            return { color: '#89969F' };
          case 'Rechazado':
            return { color: '#FF0000' };
          default:
            return {};
        }
      }
    },
    {
      def: 'oc',
      title: 'Nº OC',
      value: (element: OrdenCargaAnticipoRetirado) => element.orden_carga_id,
    },
    {
      def: 'camion_placa',
      title: 'Tracto',
      value: (element: OrdenCargaAnticipoRetirado) => element.camion_placa,
    },
    {
      def: 'chofer_nombre',
      title: 'Chofer',
      value: (element: OrdenCargaAnticipoRetirado) => element.chofer_nombre,
    },
    {
      def: 'concepto',
      title: 'Mercaderia',
      value: (element: OrdenCargaAnticipoRetirado) => element.concepto_detalle,
    },

    {
      def: 'punto_venta_alias',
      title: 'Establecimiento',
      value: (element: OrdenCargaAnticipoRetirado) => element.punto_venta_alias,
    },
    {
      def: 'proveedor_nombre',
      title: 'Proveedor',
      value: (element: OrdenCargaAnticipoRetirado) => element.proveedor_nombre,
    },

    {
      def: 'punto_venta_pais_nombre',
      title: 'País',
      value: (element: OrdenCargaAnticipoRetirado) =>
        element.punto_venta_pais_nombre,
    },
    {
      def: 'monto_retirado',
      title: 'Monto retirado',
      value: (element: OrdenCargaAnticipoRetirado) =>
        `${element.monto_retirado?.toLocaleString('es-ES', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        })} ${element.moneda_simbolo}`,
      type: 'text',
    },
    // {
    //   def: 'monto_retirado',
    //   title: 'Monto retirado',
    //   value: (element: OrdenCargaAnticipoRetirado) => element.monto_retirado,
    //   type: 'number',
    // },
    {
      def: 'monto_litro',
      title: 'Litros',
      value: (element: OrdenCargaAnticipoRetirado) => element.cantidad_retirada,
      type: 'number',
    },
    // {
    //   def: 'gestor_carga_moneda_nombre',
    //   title: 'Moneda Equiv.',
    //   value: (element: OrdenCargaAnticipoRetirado) =>
    //     element.moneda_nombre,
    // },
    {
      def: 'monto_equiv',
      title: 'Monto Equiv.',
      value: (element: OrdenCargaAnticipoRetirado) =>
        `${element.monto_mon_local?.toLocaleString('es-ES', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        })} ${element.gestor_carga_moneda_simbolo}`,
      type: 'text',
    },
    // {
    //   def: 'monto_equiv',
    //   title: 'Monto Equiv.',
    //   value: (element: OrdenCargaAnticipoRetirado) => element.monto_mon_local,
    //   type: 'number',
    // },
    //  {
    //   def: 'moneda_nombre',
    //   title: 'Moneda',
    //   value: (element: OrdenCargaAnticipoRetirado) => element.gestor_carga_moneda_nombre,
    // },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: OrdenCargaAnticipoRetirado) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: OrdenCargaAnticipoRetirado) => element.created_at,
      type: 'date-time',
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: OrdenCargaAnticipoRetirado) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: OrdenCargaAnticipoRetirado) => element.modified_at,
      type: 'date-time',
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

   isFiltered = false;
   list: OrdenCargaAnticipoRetirado[] = [];
   proveedorFilterList: string[] = [];
   proveedorFiltered: string[] = [];
   establecimientoFilterList: string[] = [];
   establecimientoFiltered: string[] = [];
   mercaderiaFilterList: string[] = [];
   mercaderiaFiltered: string[] = [];
   ocAnticipoRetirado?: OrdenCargaAnticipoRetirado

  @Output() buttonAnticipoClicked: EventEmitter<void> = new EventEmitter<void>();

   formatDate(dateString: string): string {
     const date = new Date(dateString);
     const year = date.getFullYear();
     const month = (date.getMonth() + 1).toString().padStart(2, '0');
     const day = date.getDate().toString().padStart(2, '0');
     return `${day}-${month}-${year}`;
   }

   get isFilteredByProveedor(): boolean {
     return this.proveedorFiltered.length !== this.proveedorFilterList.length;
   }

   get isFilteredByEstablecimiento(): boolean {
     return this.establecimientoFiltered.length !== this.establecimientoFilterList.length;
   }

   get isFilteredByMercaderia(): boolean {
     return this.mercaderiaFiltered.length !== this.mercaderiaFilterList.length;
   }

   @ViewChild(MatAccordion) accordion!: MatAccordion;
   @ViewChild('proveedorCheckboxFilter')
    proveedorCheckboxFilter!: CheckboxFilterComponent;
   @ViewChild('establecimientoCheckboxFilter')
    establecimientoCheckboxFilter!: CheckboxFilterComponent;
    @ViewChild('mercaderiaCheckboxFilter')
    mercaderiaCheckboxFilter!: CheckboxFilterComponent;

   constructor(
     private ordenCargaAnticipoRetiradoService: OrdenCargaAnticipoRetiradoService,
     private reportsService: ReportsService,
     private searchService: SearchService,
     private dialog: DialogService,
     private matDialog: MatDialog,
     private router: Router
   ) {}

   ngOnInit(): void {
     this.getList();
   }

  redirectToCreate(): void {
    this.router.navigate([`/orden-carga-anticipos/${m.ORDEN_CARGA_ANTICIPO_RETIRADO}/${a.CREAR}`]);
  }

  redirectToEdit(event: TableEvent<OrdenCargaAnticipoRetirado>): void {
    this.router.navigate([
      `/orden-carga-anticipos/${m.ORDEN_CARGA}/${a.EDITAR}`,
      event.row.id,
    ]);
   }

  // redirectToShow(event: TableEvent<OrdenCargaAnticipoRetirado>): void {
  //   this.router.navigate([
  //     `/orden-carga-anticipos/${m.ORDEN_CARGA_ANTICIPO_RETIRADO}/${a.VER}`,
  //     event.row.id,
  //   ]);
  // }

  redirectToShow(event: TableEvent<OrdenCargaAnticipoRetirado>): void {
    this.ocAnticipoRetirado = this.list.find(i => i.id === event.row.id);
    if (this.ocAnticipoRetirado) {
      let dialogComponent: ComponentType<any>;
      // Verifica si tipo_insumo_id es null
      if (this.ocAnticipoRetirado.tipo_insumo_id === null) {
        dialogComponent = OcAnticipoRetiradoEfectivoAnulacionDialogComponent;
      } else {
        dialogComponent = OcAnticipoRetiradoInsumoAnulacionDialogComponent;
      }
      const dialogRef = this.dialog.open(dialogComponent, {
        width: '700px',
        data: {
          item: this.ocAnticipoRetirado,
          isShow: true,
        }
      });
    }
  }
  
  private downloadPDF(item: OrdenCargaAnticipoRetirado): void {
    this.ordenCargaAnticipoRetiradoService
      .pdf(item.id)
      .subscribe((filename) => {
        this.reportsService.downloadFile(filename).subscribe((file) => {
          saveAs(file, filename);
        });
      });
     }

  deleteRow({ row }: TableEvent<OrdenCargaAnticipoRetirado>): void {
    const message = `¿Está seguro que desea eliminar el OrdenCarga con Nº ${row.id}?`;
    this.dialog.confirmationToDelete(
      message,
      this.ordenCargaAnticipoRetiradoService.delete(row.id),
      (_) => {
        this.getList();
      }
    );
   }

  anular({ row }: TableEvent<OrdenCargaAnticipoRetirado>): void {
    let dialogRef: MatDialogRef<any>;

    if (row.tipo_insumo_id === null) {
      dialogRef = this.getDialogEfectivoAnulacionRef(row);
    } else {
      dialogRef = this.getDialogInsumoAnulacionRef(row);
    }

    dialogRef.afterClosed().subscribe((result) => {
      // Actualizá la tabla
      this.getList();
    });

    this.buttonAnticipoClicked.emit();
  }

  private getDialogEfectivoAnulacionRef(
    item?: OrdenCargaAnticipoRetirado
  ): MatDialogRef<
    OcAnticipoRetiradoEfectivoAnulacionDialogComponent,
    OrdenCargaAnticipoRetirado
  > {
    const data: OcAnticipoRetiradoListDialogData = {
      item,
    };

    const dialogRef = this.matDialog.open(OcAnticipoRetiradoEfectivoAnulacionDialogComponent, {
      width: '700px',
      height: 'auto',
      data,
    });

    return dialogRef;
  }

  private getDialogInsumoAnulacionRef(
    item?: OrdenCargaAnticipoRetirado
  ): MatDialogRef<
    OcAnticipoRetiradoInsumoAnulacionDialogComponent,
    OrdenCargaAnticipoRetirado
  > {
    const data: OcAnticipoRetiradoListDialogData = {
      item,
    };

    const dialogRef = this.matDialog.open(
      OcAnticipoRetiradoInsumoAnulacionDialogComponent,
      {
        width: '720px',
        height: 'auto',
        data,
      }
    );

    return dialogRef;
  }

  fnHideAnular = (row: OrdenCargaAnticipoRetirado): boolean => {
    return row?.estado_movimiento !== 'Anulado';
  };

  filterPredicate(obj: OrdenCargaAnticipoRetirado, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByProveedor =
      filter.proveedor
        ?.split('|')
        .some((x) => obj.proveedor_nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByEstablecimiento =
      filter.establecimiento
        ?.split('|')
        .some((x) => obj.punto_venta_alias.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByMercaderia =
      filter.mercaderia
        ?.split('|')
        .some((x) => obj.concepto_detalle.toLowerCase().indexOf(x) >= 0) ?? true;
    return filterByProveedor && filterByEstablecimiento && filterByMercaderia
   }

  applyFilter(): void {
     let filter: Filter = {};
     this.isFiltered = false;
     this.proveedorFiltered = this.proveedorCheckboxFilter.getFilteredList();
     this.establecimientoFiltered = this.establecimientoCheckboxFilter.getFilteredList();
     this.mercaderiaFiltered = this.mercaderiaCheckboxFilter.getFilteredList();
     if (this.isFilteredByProveedor) {
       filter.proveedor = this.proveedorFiltered.join('|');
       this.isFiltered = true;
     }
      if (this.isFilteredByEstablecimiento) {
       filter.establecimiento = this.establecimientoFiltered.join('|');
       this.isFiltered = true;
     }
      if (this.isFilteredByMercaderia) {
       filter.mercaderia = this.mercaderiaFiltered.join('|');
       this.isFiltered = true;
     }
     this.filter(
       this.isFiltered ? JSON.stringify(filter) : '',
       !this.isFiltered
     );
  }

  resetFilter(): void {
    this.resetFilterList();
    this.filter('');
  }

  private getList(): void {
    this.ordenCargaAnticipoRetiradoService.getList().subscribe((list) => {
      this.list = list;
      this.proveedorFilterList = getFilterList(list, (x) => x.proveedor_nombre);
      this.establecimientoFilterList = getFilterList(list, (x) => x.punto_venta_alias);
      this.mercaderiaFilterList = getFilterList(list, (x) => x.concepto_detalle);
      this.resetFilterList();
    });
  }

  private filter(
     filter: string,
     isFilteredByGlobalSearch: boolean = true
   ): void {
     this.searchService.search(filter, isFilteredByGlobalSearch);
     this.accordion.closeAll();
  }

  private resetFilterList(): void {
    this.isFiltered = false;
    this.proveedorFiltered = this.proveedorFilterList.slice();
    this.establecimientoFiltered = this.establecimientoFilterList.slice();
    this.mercaderiaFiltered = this.mercaderiaFilterList.slice();
  }

}
