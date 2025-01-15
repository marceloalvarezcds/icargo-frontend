import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReportsService } from 'src/app/services/reports.service';
import { OrdenCargaAnticipoRetiradoService } from 'src/app/services/orden-carga-anticipo-retirado.service';
import { create, edit, remove } from 'src/app/utils/table-event-crud';
import { TableEvent } from 'src/app/interfaces/table';
import * as saveAs from 'file-saver';
import { OcAnticipoRetiradoDialogData } from 'src/app/interfaces/oc-anticipo-retirado-dialog-data';
import { OcAnticipoRetiradoMockupComponent } from 'src/app/dialogs/oc-anticipo-retirado-mockup/oc-anticipo-retirado-mockup.component';
import { OcGestionLineaComponent } from 'src/app/dialogs/oc-gestion-linea/oc-gestion-linea.component';
import { EvaluacionesDialogComponent } from 'src/app/dialogs/evaluaciones-dialog/evaluaciones-dialog.component';
import { Flete, FleteList } from 'src/app/interfaces/flete';

@Component({
  selector: 'app-orden-carga-anticipos-table',
  templateUrl: './orden-carga-anticipos-table.component.html',
  styleUrls: ['./orden-carga-anticipos-table.component.scss']
})
export class OrdenCargaAnticiposTableComponent implements OnInit {
  monedaEquiv1: number | null = null;
  monedaEquiv2: number = 0;
  initialFleteId: number = 32;  // Asignar el valor inicial de flete_id aquí.

  anticiposEfectivo: any[] = [];
  anticiposCombustible: any[] = [];
  isButtonPressed: boolean = false;
  @Output() fleteChange = new EventEmitter<FleteList>();

  a = PermisoAccionEnum;

  colapseDivAnticipo = false;

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

  ngOnInit(): void {

    if (this.list?.length > 0) {
      this.monedaEquiv1 = this.list[0].monto_retirado ? +this.list[0].monto_retirado : null;
    }

    this.anticiposEfectivo = this.filteredAnticipos.filter(anticipo => anticipo.concepto.toLowerCase() === 'efectivo');
    this.anticiposCombustible = this.filteredAnticipos.filter(anticipo => anticipo.concepto.toLowerCase() === 'combustible');
  }


  modelo = m.ORDEN_CARGA_ANTICIPO_RETIRADO;


  @Input() isFormSaved: boolean = false;
  @Input() isEditPedido: boolean = false;
  @Input() oc?: OrdenCarga;
  @Input() flete?: Flete;
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
  @Output() buttonAnticipoClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private ordenCargaAnticipoRetiradoService: OrdenCargaAnticipoRetiradoService,
    private reportsService: ReportsService,
  ) {}

  get isAnticiposLiberados(): boolean {
    return !!this.oc?.anticipos_liberados;
  }

  get montoRetirado(): boolean {
    return !!this.ocRetirado?.monto_retirado;
  }


  get filteredAnticipos(): any[] {
    // Filtrar anticipos para incluir solo 'combustible', 'efectivo' y 'lubricantes'
    const anticiposFiltrados = this.oc?.porcentaje_anticipos?.filter((anticipo: any) =>
      ['combustible', 'efectivo', 'lubricantes'].includes(anticipo.concepto.toLowerCase())
    ) || [];

    // Ordenar anticipos: primero 'efectivo', luego 'combustible', y después 'lubricantes'
    return anticiposFiltrados.sort((a, b) => {
      const order = ['efectivo', 'combustible', 'lubricantes'];
      const indexA = order.indexOf(a.concepto.toLowerCase());
      const indexB = order.indexOf(b.concepto.toLowerCase());
      return indexA - indexB;
    });
  }



  getSaldoAnticipoNuevo(anticipo: any): number {
    const tarifaEfectivo = this.flete?.condicion_gestor_carga_tarifa ?? 0;
    const cantidadNominada = this.oc?.cantidad_nominada ?? 0;
    const anticipoPorcentaje = anticipo?.porcentaje ?? 0;
    const montoAnticipo = tarifaEfectivo * cantidadNominada * (anticipoPorcentaje / 100);
    const monto = this.oc?.flete_monto_efectivo_complemento  ?? 0;

    if (anticipo.concepto.toUpperCase() === 'EFECTIVO') {
        const montoRetiradoEfectivo = this.oc?.resultado_propietario_total_anticipos_retirados_efectivo ?? 0;
        return monto - montoRetiradoEfectivo; // Restar anticipos de efectivo
    } else if (anticipo.concepto.toUpperCase() === 'COMBUSTIBLE') {
        const montoRetiradoCombustible = this.oc?.resultado_propietario_total_anticipos_retirados_combustible ?? 0;
        return montoAnticipo - montoRetiradoCombustible; // Restar anticipos de combustible
    } else {
        return 0;
    }
  }

  getSaldoAnticipo(anticipo: any): number {
    const tarifaEfectivo = this.oc?.flete_tarifa ?? 0;
    const cantidadNominada = this.oc?.cantidad_nominada ?? 0;
    const anticipoPorcentaje = anticipo?.porcentaje ?? 0;
    const montoAnticipo = tarifaEfectivo * cantidadNominada * (anticipoPorcentaje / 100);
    const monto = this.oc?.flete_monto_efectivo_complemento ?? 0;

    if (anticipo.concepto.toUpperCase() === 'EFECTIVO') {
      const montoRetiradoEfectivo = this.oc?.resultado_propietario_total_anticipos_retirados_efectivo ?? 0;
      return monto - montoRetiradoEfectivo; // Restar anticipos de efectivo
    } else if (anticipo.concepto.toUpperCase() === 'COMBUSTIBLE') {
      const montoRetiradoCombustible = this.oc?.resultado_propietario_total_anticipos_retirados_combustible ?? 0;
      return montoAnticipo - montoRetiradoCombustible; // Restar anticipos de combustible
    } else if (anticipo.concepto.toUpperCase() === 'LUBRICANTES') {
      const montoRetiradoLubricantes = this.oc?.resultado_propietario_total_anticipos_retirados_lubricantes ?? 0;
      return montoAnticipo - montoRetiradoLubricantes; // Restar anticipos de lubricantes
    } else {
      return 0;
    }
  }

  get hasLubricantesWithSaldo(): boolean {
    return this.filteredAnticipos?.some(a => a.concepto.toLowerCase() === 'lubricantes' && this.getSaldoAnticipo(a) > 0);
  }

openEvaluacionesDialog(): void {
  this.dialog.open(EvaluacionesDialogComponent, {
    data: { orden_carga_id: this.oc?.id,
            camion_id: this.oc?.camion_id,
            semi_id: this.oc?.semi_id,
            propietario_id: this.oc?.combinacion_propietario_id,
            chofer_id: this.oc?.combinacion_chofer_id,
            gestor_carga_id: this.oc?.gestor_carga_id,
            origen_id: this.oc?.origen_id,
            destino_id: this.oc?.destino_id,
            producto_id: this.oc?.flete_producto_id
    },
    width: '30rem',
    height: 'auto',
    panelClass: 'custom-dialog-container'
  });
}

  openDialog(): void {
    this.dialog.open(OcGestionLineaComponent, {
      width: '1600px',
      data: { oc: this.oc, porcentaje: this.oc?.flete_anticipos}

    });
  }

  create(): void {
    create(this.getDialogRef(), this.emitOcChange.bind(this));
    this.buttonAnticipoClicked.emit();
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
      oc: this.oc,
      item,
    };
    return this.dialog.open(OcAnticipoRetiradoMockupComponent, {
      width: '700px',
      height: 'auto',
      data });
  }

  shouldRenderEfectivoSaldo(): boolean {
    // Si filteredAnticipos no contiene 'Efectivo', muestra el saldo por defecto
    return !!this.filteredAnticipos.find(anticipo => anticipo.concepto.toLowerCase() === 'efectivo');
  }

  getSaldoEfectivo(): number {
    // Obtiene el saldo del anticipo "Efectivo"
    const efectivoAnticipo = this.filteredAnticipos.find(anticipo => anticipo.concepto.toLowerCase() === 'efectivo');
    return efectivoAnticipo ? this.getSaldoAnticipo(efectivoAnticipo) : 0;
  }


  private emitOcChange(): void {
    this.ocChange.emit();
  }
  @Input() isDisabled: boolean = false;
}
