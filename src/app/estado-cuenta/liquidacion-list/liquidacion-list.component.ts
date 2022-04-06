import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { filter } from 'rxjs/operators';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { TableEvent } from 'src/app/interfaces/table';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-liquidacion-list',
  templateUrl: './liquidacion-list.component.html',
  styleUrls: ['./liquidacion-list.component.scss'],
})
export class LiquidacionListComponent implements OnInit {
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº de Liquidación',
      value: (element: Liquidacion) => element.id,
      sticky: true,
    },
    {
      def: 'created_at',
      title: 'Fecha de Aprobación',
      value: (element: Liquidacion) => element.created_at,
      type: 'date',
    },
    {
      def: 'created_by',
      title: 'Aprobado por',
      value: (element: Liquidacion) => element.created_by,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: Liquidacion) => element.estado,
    },
    {
      def: 'tipo_operacion_descripcion',
      title: 'Cobro/Pago',
      value: (element: Liquidacion) => element.tipo_operacion_descripcion,
    },
    {
      def: 'movimientos_saldo',
      title: 'Valor de la Operación',
      value: (element: Liquidacion) => element.movimientos_saldo,
      type: 'number',
    },
    {
      def: 'instrumentos_saldo',
      title: 'Valor de los instrumentos',
      value: (element: Liquidacion) => element.instrumentos_saldo,
      type: 'number',
    },
    {
      def: 'saldo_residual',
      title: 'Residuo',
      value: (element: Liquidacion) => element.saldo_residual,
      type: 'number',
    },
    {
      def: 'moneda_nombre',
      title: 'Moneda',
      value: (element: Liquidacion) => element.moneda_nombre,
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  credito = 0;
  debito = 0;
  backUrl = `/estado-cuenta/${m.ESTADO_CUENTA}/${a.LISTAR}`;
  modelo = m.LIQUIDACION;
  etapa?: LiquidacionEtapaEnum;
  estadoCuenta?: EstadoCuenta;
  list: Liquidacion[] = [];

  get confirmadoPath(): string {
    return this.esConfirmado
      ? '/' + LiquidacionEtapaEnum.CONFIRMADO.toLowerCase()
      : '';
  }

  get esConfirmado(): boolean {
    return this.etapa === LiquidacionEtapaEnum.CONFIRMADO;
  }

  get saldo(): number {
    return this.credito - this.debito;
  }

  get instrumentosSaldo(): number {
    return this.list.reduce((acc, cur) => acc + cur.instrumentos_saldo, 0);
  }

  get residuo(): number {
    return this.list.reduce((acc, cur) => acc + cur.saldo_residual, 0);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private estadoCuentaService: EstadoCuentaService,
    private liquidacionService: LiquidacionService,
    private reportsService: ReportsService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  back(): void {
    this.router.navigate([this.backUrl]);
  }

  redirectToEdit(event: TableEvent<Liquidacion>): void {
    this.router.navigate([
      `/estado-cuenta${this.confirmadoPath}/${m.LIQUIDACION}/${a.EDITAR}`,
      event.row.id,
    ]);
  }

  redirectToShow(event: TableEvent<Liquidacion>): void {
    this.router.navigate([
      `/estado-cuenta${this.confirmadoPath}/${m.LIQUIDACION}/${a.VER}`,
      event.row.id,
    ]);
  }

  downloadFile(): void {
    this.liquidacionService
      .generateReportsByEstadoCuenta(this.estadoCuenta!, this.etapa!)
      .subscribe((filename) => {
        this.reportsService.downloadFile(filename).subscribe((file) => {
          saveAs(file, filename);
        });
      });
  }

  private getData(): void {
    const {
      backUrl,
      etapa,
      contraparte,
      contraparte_numero_documento,
      tipo_contraparte_id,
    } = this.route.snapshot.queryParams;
    if (backUrl) {
      this.backUrl = backUrl;
    }
    this.etapa = etapa;
    this.estadoCuentaService
      .getByContraparte(
        tipo_contraparte_id,
        contraparte,
        contraparte_numero_documento
      )
      .pipe(filter((e) => !!e))
      .subscribe((estadoCuenta) => {
        this.estadoCuenta = estadoCuenta!;
        this.getList();
      });
  }

  private getList(): void {
    this.liquidacionService
      .getListByEstadoCuenta(this.estadoCuenta!, this.etapa!)
      .subscribe((data) => {
        this.credito = data.reduce((acc, cur) => acc + cur.credito, 0);
        this.debito = data.reduce((acc, cur) => acc + cur.debito, 0);
        this.list = data;
      });
  }
}
