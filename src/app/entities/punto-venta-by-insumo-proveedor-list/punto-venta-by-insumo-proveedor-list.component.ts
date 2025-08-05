import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InsumoVentaPrecioDialogComponent } from 'src/app/dialogs/insumo-venta-precio-dialog/insumo-venta-precio-dialog.component';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { InsumoPuntoVentaPrecio, InsumoPuntoVentaPrecioList } from 'src/app/interfaces/insumo-punto-venta-precio';
import { PuntoVenta, PuntoVentaList } from 'src/app/interfaces/punto-venta';
import { TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { InsumoPuntoVentaPrecioService } from 'src/app/services/insumo-punto-venta-precio.service';
import { PuntoVentaService } from 'src/app/services/punto-venta.service';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-punto-venta-by-insumo-proveedor-list',
  templateUrl: './punto-venta-by-insumo-proveedor-list.component.html',
  styleUrls: ['./punto-venta-by-insumo-proveedor-list.component.scss']
})
export class PuntoVentaByInsumoProveedorListComponent implements OnInit{
  a = PermisoAccionEnum;
  item?: InsumoPuntoVentaPrecioList;
  pdv?: PuntoVenta;
  puntoVentaFormId?: number;
  proveedorId?: number;
  proveedor_nombre?: string;
  punto_venta_nombre?: string;
  modelo = m.INSUMO_PUNTO_VENTA_PRECIO;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: InsumoPuntoVentaPrecioList) => element.id,
      sticky: true,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: InsumoPuntoVentaPrecioList) => element.estado.toUpperCase(),
    },

    {
      def: 'proveedor',
      title: 'Proveedor',
      value: (element: InsumoPuntoVentaPrecioList) => element.proveedor_nombre,
    },
    {
      def: 'punto_venta_nombre',
      title: 'Nombre del Establecimiento',
      value: (element: InsumoPuntoVentaPrecioList) => element.punto_venta_alias,
    },
    {
      def: 'insumo_tipo_descripcion',
      title: 'Mercaderia',
      value: (element: InsumoPuntoVentaPrecioList) => element.insumo_descripcion,
    },

    {
      def: 'precio',
      title: 'Precio',
      value: (element: InsumoPuntoVentaPrecioList) => element.precio,
      type: 'number',
    },

    {
      def: 'moneda',
      title: 'Moneda',
      value: (element: InsumoPuntoVentaPrecioList) => element.insumo_moneda_nombre,
    },

    {
      def: 'fecha',
      title: 'Fecha Vigencia',
      value: (element: InsumoPuntoVentaPrecioList) => element.fecha_inicio,
      type: 'only-date',
    },

    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  list: InsumoPuntoVentaPrecioList[] = [];
  pdvId?: number;

  @Input() set puntoVentaId(id: number | undefined) {
    if (id) {
      this.pdvId = id;
      this.getList(id);
    }
  }

  @Input() subModuleName = "MERCADERIA";
  @Input() hideSubModule = false;
  @Input() isShow = false;
  @Input() isEdit = false;
  @Input() backUrl = `/insumo_punto_venta_precio/${m.INSUMO_PUNTO_VENTA_PRECIO}/${a.LISTAR}`;

  isFiltered = false;

  constructor(
    private insumoPuntoVentaPrecioService: InsumoPuntoVentaPrecioService,
    private puntoVentaService: PuntoVentaService,
    private reportsService: ReportsService,
    private dialog: DialogService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.pdvId !== undefined) {
      this.insumoPuntoVentaPrecioService.getListByPuntoVentaId(this.pdvId).subscribe((data) => {
        if (data && data.length > 0) {
          this.item = data[0];
        }
      }, (error) => {
        console.error('Error al obtener los items del punto de venta:', error);
      });
    }

    this.getDatosPDV();
  }

  refreshList(){
    if (this.pdvId !== undefined) {
      this.getList(this.pdvId)
    }

  }

  getDatosPDV() {
    if (this.pdvId !== undefined) {
      this.puntoVentaService.getById(this.pdvId).subscribe((data) => {
        this.pdv = data;
        this.puntoVentaFormId = data.id;
        this.proveedorId = data.proveedor_id
        if (data && data.nombre_corto) {
          this.punto_venta_nombre = data.nombre_corto;
        }
        if (data && data.proveedor_nombre) {
          this.proveedor_nombre = data.proveedor_nombre;
        }
      }, (error) => {
        console.error('Error al obtener los items del punto de venta:', error);
      });
    }
  }

   // TODO: pendiente agregar filtros al pdv
   filterPredicate(): boolean {
    return false;
  }

  applyFilter(){

  }
  resetFilter(){

  }

  convertTo12HourFormat(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  private getList(pdvId: number): void {
    this.insumoPuntoVentaPrecioService.getListByPuntoVentaId(pdvId).subscribe((list) => {
      this.list = list.map(item => {
        return {
          ...item,
          hora: item.created_at_insumo ? this.convertTo12HourFormat(new Date(item.created_at_insumo)) : null
        };
      });
      if (this.list.length > 0) {
        this.item = this.list[0];
      }
      this.cdr.markForCheck();
    });
  }

  redirectToShow(event: TableEvent<InsumoPuntoVentaPrecio>): void {
    this.item = this.list.find(i => i.id === event.row.id);
    const dialogRef = this.dialog.open(InsumoVentaPrecioDialogComponent, {
      width: '800px',
      data: {
        id: event.row.id,
        item: this.item,
        isShow: true,
        isEdit: true,
        punto_venta_id: this.puntoVentaFormId,
        punto_venta_nombre: this.punto_venta_nombre,
        hora: this.item?.created_at_insumo ?
        this.convertTo12HourFormat(new Date(this.item?.created_at_insumo)) : null
      }
    });
    dialogRef.componentInstance.dataSaved.subscribe(() => {
      this.getList(this.pdvId!);
    });
  }


  redirectToEdit(event: TableEvent<InsumoPuntoVentaPrecio>): void {
    this.item = this.list.find(i => i.id === event.row.id);
    const dialogRef = this.dialog.open(InsumoVentaPrecioDialogComponent, {
      width: '800px',
      data: {
        id: event.row.id,
        item: this.item,
        isEdit: true,
        punto_venta_id: this.puntoVentaFormId,
        punto_venta_nombre: this.punto_venta_nombre,
        hora: this.item?.created_at_insumo ?
        this.convertTo12HourFormat(new Date(this.item?.created_at_insumo)) : null
      }
    });

    dialogRef.componentInstance.dataSaved.subscribe(() => {
      this.getList(this.pdvId!);
    });
  }


  createMercaderia(): void {
    const dialogRef = this.dialog.open(InsumoVentaPrecioDialogComponent, {
      width: '800px',
      data: {
        punto_venta_id: this.puntoVentaFormId,
        punto_venta_nombre: this.punto_venta_nombre,
        proveedor_id: this.proveedorId,
        proveedor_nombre: this.proveedor_nombre,
      }
    });

    dialogRef.componentInstance.dataSaved.subscribe(() => {
      this.getList(this.pdvId!);
    });
  }


  nuevoPrecio(): void {
    const dialogRef = this.dialog.open(InsumoVentaPrecioDialogComponent, {
      width: '800px',
      data: {
        id: this.item?.id,
        item: this.item,
        isEdit: true,
        punto_venta_id: this.puntoVentaFormId,
        punto_venta_nombre: this.punto_venta_nombre,
      }
    });
    dialogRef.componentInstance.dataSaved.subscribe(() => {
      this.getList(this.pdvId!);
    });
  }
}
