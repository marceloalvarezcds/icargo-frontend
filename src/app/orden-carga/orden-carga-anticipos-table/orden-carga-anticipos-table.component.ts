import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PermisoModeloEnum } from 'src/app/enums/permiso-enum';
import { DialogFieldComponent } from 'src/app/form-field/dialog-field/dialog-field.component';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { FleteList } from 'src/app/interfaces/flete';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import { FleteService } from 'src/app/services/flete.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReportsService } from 'src/app/services/reports.service';
import { OrdenCargaAnticipoRetiradoService } from 'src/app/services/orden-carga-anticipo-retirado.service';
import { create, edit, remove } from 'src/app/utils/table-event-crud';
import { TableEvent } from 'src/app/interfaces/table';
import * as saveAs from 'file-saver';
import { OcAnticipoRetiradoFormDialogComponent } from 'src/app/dialogs/oc-anticipo-retirado-form-dialog/oc-anticipo-retirado-form-dialog.component';
import { OcAnticipoRetiradoDialogData } from 'src/app/interfaces/oc-anticipo-retirado-dialog-data';
import { OcAnticipoRetiradoMockupComponent } from 'src/app/dialogs/oc-anticipo-retirado-mockup/oc-anticipo-retirado-mockup.component';
import { OcGestionLineaComponent } from 'src/app/dialogs/oc-gestion-linea/oc-gestion-linea.component';
import { OrdenCargaEditFormAnticiposResumenComponent } from '../orden-carga-edit-form-anticipos-resumen/orden-carga-edit-form-anticipos-resumen.component';
import { OrdenCargaCreateFormComponent } from '../orden-carga-create-form/orden-carga-create-form.component';
import { OrdenCargaGestionAnticiposComponent } from 'src/app/dialogs/orden-carga-gestion-anticipos/orden-carga-gestion-anticipos.component';

@Component({
  selector: 'app-orden-carga-anticipos-table',
  templateUrl: './orden-carga-anticipos-table.component.html',
  styleUrls: ['./orden-carga-anticipos-table.component.scss']
})
export class OrdenCargaAnticiposTableComponent implements OnInit {
  monedaEquiv1: number | null = null;
  monedaEquiv2: number = 0;
  anticiposEfectivo: any[] = [];
  anticiposCombustible: any[] = [];

  a = PermisoAccionEnum;
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
      sticky: true,
    },
    {
      def: 'concepto',
      title: 'Concepto',
      value: (element: OrdenCargaAnticipoRetirado) => element.concepto,
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
      value: (element: OrdenCargaAnticipoRetirado) => element.monto_retirado,
      type: 'number',
    },
    {
      def: 'moneda_nombre',
      title: 'Moneda',
      value: (element: OrdenCargaAnticipoRetirado) => element.moneda_nombre,
    },
    {
      def: 'monto_equiv',
      title: 'Monto Equiv.',
      value: (element: OrdenCargaAnticipoRetirado) => element.monto_retirado,
      type: 'number',
    },
    {
      def: 'gestor_carga_moneda_nombre',
      title: 'Moneda Equiv.',
      value: (element: OrdenCargaAnticipoRetirado) =>
        element.gestor_carga_moneda_nombre,
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: OrdenCargaAnticipoRetirado) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: OrdenCargaAnticipoRetirado) => this.formatDate(element.created_at),
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: OrdenCargaAnticipoRetirado) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: OrdenCargaAnticipoRetirado) => this.formatDate(element.modified_at),
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  ngOnInit(): void {
    if (this.list.length > 0) {
      this.monedaEquiv1 = this.list[0].monto_retirado ? +this.list[0].monto_retirado : null;
    }
      this.anticiposEfectivo = this.filteredAnticipos.filter(anticipo => anticipo.concepto.toLowerCase() === 'efectivo');
        this.anticiposCombustible = this.filteredAnticipos.filter(anticipo => anticipo.concepto.toLowerCase() === 'combustible');
  }
  

  modelo = m.ORDEN_CARGA_ANTICIPO_RETIRADO;


  @Input() isFormSaved: boolean = false;
  @Input() oc?: OrdenCarga;
  @Input() ocRetirado?: OrdenCargaAnticipoRetirado;
  @Input() gestorCargaId?: number;
  @Input() isShow = false;
  @Input() isCreate = false;
  @Input() puedeConciliar = false;
  @Input() list: OrdenCargaAnticipoRetirado[] = [];

  @Input() item?: any;
  @Input() fleteId?: number;
  @Input() ordenCargaId: number | null = null;

  @Output() ocChange = new EventEmitter<void>();
  
  constructor(
    private dialog: MatDialog,
    private ordenCargaAnticipoRetiradoService: OrdenCargaAnticipoRetiradoService,
    private reportsService: ReportsService
  ) {}

  get isAnticiposLiberados(): boolean {
    return !!this.oc?.anticipos_liberados;
  }

  get montoRetirado(): boolean {
    return !!this.ocRetirado?.monto_retirado;
  }

  get filteredAnticipos(): any[] {
    // Filtrar anticipos para incluir solo 'combustible' y 'efectivo'
    const anticiposFiltrados = this.oc?.porcentaje_anticipos?.filter((anticipo: any) =>
      ['combustible', 'efectivo'].includes(anticipo.concepto.toLowerCase())
    ) || [];

    // Ordenar anticipos: primero 'efectivo', luego 'combustible'
    return anticiposFiltrados.sort((a, b) => {
      if (a.concepto.toLowerCase() === 'efectivo' && b.concepto.toLowerCase() === 'combustible') {
        return -1; // 'Efectivo' va primero
      } else if (a.concepto.toLowerCase() === 'combustible' && b.concepto.toLowerCase() === 'efectivo') {
        return 1; // 'Combustible' va después
      }
      return 0; // Mantener el orden original si no es 'Efectivo' ni 'Combustible'
    });
  }


  getSaldoAnticipo(anticipo: any): number {
    const tarifaEfectivo = this.oc?.flete_tarifa ?? 0;
    const cantidadNominada = this.oc?.cantidad_nominada ?? 0;

    const anticipoPorcentaje = anticipo?.porcentaje ?? 0;
    const montoAnticipo = tarifaEfectivo * cantidadNominada * (anticipoPorcentaje / 100);

    console.log('Monto Anticipo Total:', montoAnticipo); // Depuración

    if (anticipo.concepto.toUpperCase() === 'EFECTIVO') {
        const montoRetiradoEfectivo = this.oc?.resultado_propietario_total_anticipos_retirados_efectivo ?? 0;
        console.log('Monto Anticipo Efectivo:', montoAnticipo); // Depuración
        return montoAnticipo - montoRetiradoEfectivo; // Restar anticipos de efectivo
    } else if (anticipo.concepto.toUpperCase() === 'COMBUSTIBLE') {
        const montoRetiradoCombustible = this.oc?.resultado_propietario_total_anticipos_retirados_combustible ?? 0;
        console.log('Monto Anticipo Combustible:', montoAnticipo); // Depuración
        return montoAnticipo - montoRetiradoCombustible; // Restar anticipos de combustible
    } else {
        console.log('Concepto no reconocido'); // Depuración
        return 0;
    }
}



  openDialog(): void {
    this.dialog.open(OcGestionLineaComponent, {
      width: '1600px',  
      data: { oc: this.oc } 
    });
  }

  create(): void {
    create(this.getDialogRef(), this.emitOcChange.bind(this));
  }

  edit({ row }: TableEvent<OrdenCargaAnticipoRetirado>): void {
    edit(this.getDialogRef(row), this.emitOcChange.bind(this));
  }

  remove({ row }: TableEvent<OrdenCargaAnticipoRetirado>): void {
    remove(
      this.dialog,
      `¿Está seguro que desea eliminar el anticipo ${row.tipo_anticipo_descripcion}?`,
      () => {
        this.ordenCargaAnticipoRetiradoService
          .delete(row.id)
          .subscribe(this.emitOcChange.bind(this));
      }
    );
  }

  @Input() isDisabled: boolean = false;
  private downloadPDF(item: OrdenCargaAnticipoRetirado): void {
    this.ordenCargaAnticipoRetiradoService
      .pdf(item.id)
      .subscribe((filename) => {
        this.reportsService.downloadFile(filename).subscribe((file) => {
          saveAs(file, filename);
        });
      });
  }

  private getDialogRef(
    item?: OrdenCargaAnticipoRetirado
  ): MatDialogRef<
    OcAnticipoRetiradoMockupComponent,
    OrdenCargaAnticipoRetirado
  > {
    const data: OcAnticipoRetiradoDialogData = {
      orden_carga_id: this.oc!.id,
      flete_id: this.oc!.flete_id,
      item,
    };
    return this.dialog.open(OcAnticipoRetiradoMockupComponent, {     
      width: '700px', 
      height: 'auto', 
      data });
  }

  private emitOcChange(): void {
    this.ocChange.emit();
  }

}
