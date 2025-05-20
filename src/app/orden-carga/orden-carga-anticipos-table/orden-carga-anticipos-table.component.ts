import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { OrdenCarga, OrdenCargaList } from 'src/app/interfaces/orden-carga';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReportsService } from 'src/app/services/reports.service';
import { OrdenCargaAnticipoRetiradoService } from 'src/app/services/orden-carga-anticipo-retirado.service';
import { create, edit, remove } from 'src/app/utils/table-event-crud';
import { TableEvent } from 'src/app/interfaces/table';
import * as saveAs from 'file-saver';
import { OcAnticipoRetiradoDialogData, OcAnticipoRetiradoTestDialogData } from 'src/app/interfaces/oc-anticipo-retirado-dialog-data';
import { OcAnticipoRetiradoMockupComponent } from 'src/app/dialogs/oc-anticipo-retirado-mockup/oc-anticipo-retirado-mockup.component';
import { OcGestionLineaComponent } from 'src/app/dialogs/oc-gestion-linea/oc-gestion-linea.component';
import { EvaluacionesDialogComponent } from 'src/app/dialogs/evaluaciones-dialog/evaluaciones-dialog.component';
import { Flete, FleteList } from 'src/app/interfaces/flete';
import { OcAnticipoRetiradoEfectivoDialogComponent } from 'src/app/dialogs/oc-anticipo-retirado-efectivo-dialog/oc-anticipo-retirado-efectivo-dialog.component';
import { OcAnticipoRetiradoInsumoDialogComponent } from 'src/app/dialogs/oc-anticipo-retirado-insumo-dialog/oc-anticipo-retirado-insumo-dialog.component';
import { OcAnticipoRetiradoFormDialogComponent } from 'src/app/dialogs/oc-anticipo-retirado-form-dialog/oc-anticipo-retirado-form-dialog.component';
import { OcAnticipoRetiradoEfectivoAnulacionDialogComponent } from 'src/app/dialogs/oc-anticipo-retirado-efectivo-anulacion-dialog/oc-anticipo-retirado-efectivo-anulacion-dialog.component';
import { OcAnticipoRetiradoInsumoAnulacionDialogComponent } from 'src/app/dialogs/oc-anticipo-retirado-insumo-anulacion-dialog/oc-anticipo-retirado-insumo-anulacion-dialog.component';
import { ComponentType } from '@angular/cdk/overlay';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { GestorCarga } from 'src/app/interfaces/gestor-carga';
import { MonedaCotizacionService } from 'src/app/services/moneda-cotizacion.service';
import { MonedaService } from 'src/app/services/moneda.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrdenCargaAnticipoSaldoService } from 'src/app/services/orden-carga-anticipo-saldo.service';
import { FleteAnticipo } from 'src/app/interfaces/flete-anticipo';

@Component({
  selector: 'app-orden-carga-anticipos-table',
  templateUrl: './orden-carga-anticipos-table.component.html',
  styleUrls: ['./orden-carga-anticipos-table.component.scss']
})
export class OrdenCargaAnticiposTableComponent implements OnInit, OnChanges {
  monedaEquiv1: number | null = null;
  monedaEquiv2: number = 0;
  anticiposEfectivo: any[] = [];
  anticiposCombustible: any[] = [];
  isButtonPressed: boolean = false;
  isViewMode: boolean = false;
  ocAnticipoRetirado?: OrdenCargaAnticipoRetirado
  a = PermisoAccionEnum;
  e = EstadoEnum
  cotizacion: number = 0;

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
      def: 'estados_movimientos',
      title: 'Estado',
      value: (element: OrdenCargaAnticipoRetirado) => element.estados_movimientos?.toUpperCase(),
      dinamicStyles: (element: OrdenCargaAnticipoRetirado) => {
        switch (element.estados_movimientos) {
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
      value: (element: OrdenCargaAnticipoRetirado) => element.monto_retirado,
      type: 'number',
    },
    {
      def: 'monto_litro',
      title: 'Litros',
      value: (element: OrdenCargaAnticipoRetirado) => element.cantidad_retirada,
      type: 'number',
    },
    {
      def: 'moneda_nombre',
      title: 'Moneda',
      value: (element: OrdenCargaAnticipoRetirado) => element.gestor_carga_moneda_nombre,
    },
    {
      def: 'monto_equiv',
      title: 'Monto Equiv.',
      value: (element: OrdenCargaAnticipoRetirado) => element.monto_mon_local,
      type: 'number',
    },
    {
      def: 'gestor_carga_moneda_nombre',
      title: 'Moneda Equiv.',
      value: (element: OrdenCargaAnticipoRetirado) =>
        element.moneda_nombre,
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


  lista: OrdenCargaAnticipoRetirado[] = [];
  modelo = m.ORDEN_CARGA_ANTICIPO_RETIRADO;

  @Input() anticipoList: any[] = [];
  @Input() isFormSaved: boolean = false;
  @Input() isEditPedido: boolean = false;
  @Input() gestorCarga?: GestorCarga
  @Input() oc?: OrdenCarga;
  @Input() mov?: Movimiento;
  @Input() flete?: Flete;
  @Input() ocRetirado?: OrdenCargaAnticipoRetirado;
  @Input() gestorCargaId?: number;
  @Input() isShow = false;
  @Input() isCreate = false;
  @Input() puedeConciliar = false;
  @Input() list: OrdenCargaAnticipoRetirado[] = [];
  @Input() isDisabled: boolean = false;
  @Input() item?: any;
  @Input() fleteId?: number;
  @Input() ordenCargaId: number | null = null;

  @Output() fleteChange = new EventEmitter<FleteList>();
  @Output() ocAnticipoRetiradoChange = new EventEmitter<void>();;
  @Output() ocChange = new EventEmitter<void>();
  @Output() ocChangeInsumo = new EventEmitter<void>();
  @Output() buttonAnticipoClicked: EventEmitter<void> = new EventEmitter<void>();


  cotizacionOrigen: number | null = null;
  cotizacionDestino: number | null = null;
  monedaDestinoId: number | null = null;
  simboloMoneda?:string;
  monedaId: number | null = null;

  ngOnInit(): void {
    this.getMonedaByGestor()
    this.obtenerCotizaciones()
    if (this.list?.length > 0) {
      // Ordenar por ID en orden descendente
      this.list = [...this.list].sort((a, b) => b.id - a.id);
    }

    if (this.list?.length > 0) {
      this.monedaEquiv1 = this.list[0].monto_retirado ? +this.list[0].monto_retirado : null;
    }

    this.anticiposEfectivo = this.filteredAnticipos.filter(anticipo => anticipo.concepto.toLowerCase() === 'efectivo');
    this.anticiposCombustible = this.filteredAnticipos.filter(anticipo => anticipo.concepto.toLowerCase() === 'combustible');
  }


  ngOnChanges() {
    if (this.list?.length > 0) {
      this.list = [...this.list].sort((a, b) => b.id - a.id);
    }
    this.cdr.detectChanges();
  }

  constructor(
    private dialog: MatDialog,
    private ordenCargaAnticipoRetiradoService: OrdenCargaAnticipoRetiradoService,
    private reportsService: ReportsService,
    private cdr: ChangeDetectorRef,
    private monedaService: MonedaService,
    private monedaCotizacionService: MonedaCotizacionService,
    private ordenCargaAnticipoSaldoService: OrdenCargaAnticipoSaldoService,
    private snackBar: MatSnackBar
  ) {}

  getMonedaByGestor(): void {
    if (this.oc?.gestor_carga_id) {
      this.monedaService.getMonedaByGestorId(this.oc.gestor_carga_id).subscribe(
        (response) => {
          this.monedaDestinoId = response?.id ?? null;
          // console.log('Moneda ID:', this.monedaDestinoId);
        }
      );
    }
  }

  obtenerCotizaciones(): void {
    if (this.oc)
      this.monedaCotizacionService
        .getCotizacionByGestor(this.oc.flete_moneda_id, this.oc.gestor_carga_id)
        .subscribe({
          next: (responseOrigen) => {
            this.cotizacionOrigen = responseOrigen?.cotizacion_moneda ?? null;
            // console.log('Cotización Origen:', this.cotizacionOrigen);

            if (this.monedaDestinoId) {
              this.monedaCotizacionService
                .getCotizacionByGestor(this.monedaDestinoId, this.oc!.gestor_carga_id)
                .subscribe({
                  next: (responseDestino) => {
                    this.cotizacionDestino = responseDestino?.cotizacion_moneda ?? null;
                    // console.log('Cotización Destino:', this.cotizacionDestino);
                  }
                });
            }
          }
        });
  }

  getCotizacionMonedaDestino(monedaDestinoId: number): void {
    this.monedaCotizacionService
      .getCotizacionByGestor(monedaDestinoId, this.oc!.gestor_carga_id)
      .subscribe({
        next: (responseDestino) => {
          this.cotizacionDestino = responseDestino ? responseDestino.cotizacion_moneda : null;

        }
      });
  }

  get isAnticiposLiberados(): boolean {
    return !!this.oc?.anticipos_liberados;
  }

  get montoRetirado(): boolean {
    return !!this.ocRetirado?.monto_retirado;
  }

  get hasLubricantesWithSaldo(): boolean {
    return this.filteredAnticipos?.some(a => a.concepto.toLowerCase() === 'lubricantes' && this.getSaldoAnticipo(a) > 0);
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
    const saldo_efectivo = this.oc?.flete_saldo_efectivo ?? 0;
    const saldo_combustible = this.oc?.flete_saldo_combustible ?? 0;
    const saldo_lubricante = this.oc?.flete_saldo_lubricante ?? 0;
    const montoRetiradoEfectivo = this.oc?.resultado_propietario_total_anticipos_retirados_efectivo ?? 0;
    const montoRetiradoCombustible = this.oc?.resultado_propietario_total_anticipos_retirados_combustible ?? 0;
    const montoRetiradoLubricantes = this.oc?.resultado_propietario_total_anticipos_retirados_lubricantes ?? 0;
    const limiteAnticipoCamion = this.oc?.camion_limite_monto_anticipos ?? 0;
    const flete_monto_efectivo_complemento = this.oc?.flete_monto_efectivo_complemento ?? 0;
    const flete_monto_combustible = this.oc?.flete_monto_combustible ?? 0;
    const flete_monto_lubricante = this.oc?.flete_monto_lubricante ?? 0;

    if (limiteAnticipoCamion === 0) {
      // Cuando el camión no tiene límite, mostrar montos directos. Limite de la oc
      if (anticipo.concepto.toUpperCase() === 'EFECTIVO') {
        return flete_monto_efectivo_complemento - montoRetiradoEfectivo;
      } else if (anticipo.concepto.toUpperCase() === 'COMBUSTIBLE') {
        return flete_monto_combustible - montoRetiradoCombustible;
      } else if (anticipo.concepto.toUpperCase() === 'LUBRICANTES') {
        return flete_monto_lubricante - montoRetiradoLubricantes; // Restar anticipos de lubricantes
      } else {
        return 0;
      }
    }

    if (anticipo.concepto.toUpperCase() === 'EFECTIVO') {
      return saldo_efectivo- montoRetiradoEfectivo; // Restar anticipos de efectivo
    } else if (anticipo.concepto.toUpperCase() === 'COMBUSTIBLE') {
      return saldo_combustible - montoRetiradoCombustible; // Restar anticipos de combustible
    } else if (anticipo.concepto.toUpperCase() === 'LUBRICANTES') {
      return saldo_lubricante - montoRetiradoLubricantes; // Restar anticipos de lubricantes
    } else {
      return 0;
    }
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

  createEfectivo(): void {
    if (!this.oc?.camion_propietario_puede_recibir_anticipos) {
      this.snackBar.open('El Propietario no está habilitado para recibir anticipos.', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (!this.oc?.combinacion_chofer_puede_recibir_anticipos) {
      this.snackBar.open('El Chofer no esta habilitado para recibir anticipos.', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    create(this.getDialogEfectivoRef(), this.emitOcChange.bind(this));
    this.buttonAnticipoClicked.emit();
  }

  createInsumo(): void {
    if (!this.oc?.camion_propietario_puede_recibir_anticipos) {
      this.snackBar.open('El Propietario no está habilitado para recibir anticipos.', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    if (!this.oc?.combinacion_chofer_puede_recibir_anticipos) {
      this.snackBar.open('El Chofer no esta habilitado para recibir anticipos.', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    create(this.getDialogInsumoRef(), this.emitOcChange.bind(this));
    this.buttonAnticipoClicked.emit();
  }

  anular({ row }: TableEvent<OrdenCargaAnticipoRetirado>): void {
    if (row.tipo_insumo_id === null) {
      edit(this.getDialogEfectivoAnulacionRef(row), this.emitOcChange.bind(this));
    } else {
      edit(this.getDialogInsumoAnulacionRef(row), this.emitOcChange.bind(this));
    }
    this.buttonAnticipoClicked.emit();
  }


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
          orden_carga_id: this.oc!.id,
          flete_id: this.oc!.flete_id,
          oc: this.oc,
          item: this.ocAnticipoRetirado,
          isShow: true,
        }
      });
    }
  }

  redirectToEdit(event: TableEvent<OrdenCargaAnticipoRetirado>): void {
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
          orden_carga_id: this.oc!.id,
          flete_id: this.oc!.flete_id,
          oc: this.oc,
          item: this.ocAnticipoRetirado,
          isEdit: true,
          isShow: false,
        }
      });
    }
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
  OcAnticipoRetiradoFormDialogComponent,
    OrdenCargaAnticipoRetirado
  > {
    const data: OcAnticipoRetiradoDialogData = {
      orden_carga_id: this.oc!.id,
      flete_id: this.oc!.flete_id,
      oc: this.oc,
      item,
    };
    return this.dialog.open(OcAnticipoRetiradoFormDialogComponent, {
      width: '700px',
      height: 'auto',
      data });
  }

  private getDialogEfectivoRef(
    item?: OrdenCargaAnticipoRetirado
  ): MatDialogRef<
    OcAnticipoRetiradoEfectivoDialogComponent,
    OrdenCargaAnticipoRetirado
  > {

    const data: OcAnticipoRetiradoTestDialogData = {
      orden_carga_id: this.oc!.id,
      flete_id: this.oc!.flete_id,
      oc: this.oc,
      moneda_id: this.ocRetirado?.moneda_id ?? 0,
      item,
    };

    return this.dialog.open(OcAnticipoRetiradoEfectivoDialogComponent, {
      panelClass: 'half-dialog',
      data });
  }


  private getDialogInsumoRef(
    item?: OrdenCargaAnticipoRetirado
  ): MatDialogRef<
    OcAnticipoRetiradoInsumoDialogComponent,
    OrdenCargaAnticipoRetirado
  > {
    const data: OcAnticipoRetiradoDialogData = {
      orden_carga_id: this.oc!.id,
      flete_id: this.oc!.flete_id,
      oc: this.oc,
      item,
    };
    return this.dialog.open(OcAnticipoRetiradoInsumoDialogComponent, {
      panelClass: 'half-dialog',
      height: 'auto',
      data });
  }

  private getDialogEfectivoAnulacionRef(
    item?: OrdenCargaAnticipoRetirado
  ): MatDialogRef<
    OcAnticipoRetiradoEfectivoAnulacionDialogComponent,
    OrdenCargaAnticipoRetirado
  > {
    const data: OcAnticipoRetiradoTestDialogData = {
      orden_carga_id: this.oc!.id,
      flete_id: this.oc!.flete_id,
      oc: this.oc,
      moneda_id: this.ocRetirado?.moneda_id ?? 0,
      item,
    };

    return this.dialog.open(OcAnticipoRetiradoEfectivoAnulacionDialogComponent, {
      width: '700px',
      height: 'auto',
      data });
  }


  private getDialogInsumoAnulacionRef(
    item?: OrdenCargaAnticipoRetirado
  ): MatDialogRef<
    OcAnticipoRetiradoInsumoAnulacionDialogComponent,
    OrdenCargaAnticipoRetirado
  > {
    const data: OcAnticipoRetiradoDialogData = {
      orden_carga_id: this.oc!.id,
      flete_id: this.oc!.flete_id,
      oc: this.oc,
      item,
    };
    return this.dialog.open(OcAnticipoRetiradoInsumoAnulacionDialogComponent, {
      width: '720px',
      height: 'auto',
      data });
  }

  private emitOcChange(): void {
    this.ocChange.emit();
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

}
