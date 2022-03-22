import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { filter } from 'rxjs/operators';
import { EstadoEnum } from 'src/app/enums/estado-enum';
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
import { confirmationDialogToDelete } from 'src/app/utils/delete';

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
      def: 'tipo_operacion_descripcion',
      title: 'Cobro/Pago',
      value: (element: Liquidacion) => element.tipo_operacion_descripcion,
    },
    {
      def: 'movimientos_saldo',
      title: 'Valor de la Operación',
      value: (element: Liquidacion) => element.movimientos_saldo,
    },
    {
      def: 'instrumentos_saldo',
      title: 'Valor de los instrumentos',
      value: (element: Liquidacion) => element.instrumentos_saldo,
    },
    {
      def: 'saldo_residual',
      title: 'Residuo',
      value: (element: Liquidacion) => element.saldo_residual,
    },
    {
      def: 'moneda_nombre',
      title: 'Moneda',
      value: (element: Liquidacion) => element.moneda_nombre,
    },
  ];

  credito = 0;
  debito = 0;
  backUrl = `/estado-cuenta/${m.ESTADO_CUENTA}/${a.LISTAR}`;
  modelo = m.LIQUIDACION;
  estado?: EstadoEnum;
  estadoCuenta?: EstadoCuenta;
  list: Liquidacion[] = [];
  movimientosSelected: Liquidacion[] = [];

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
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private estadoCuentaService: EstadoCuentaService,
    private liquidacionService: LiquidacionService,
    private reportsService: ReportsService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  redirectToEdit(event: TableEvent<Liquidacion>): void {
    this.router.navigate([
      `/estado-cuenta/${m.LIQUIDACION}/${a.EDITAR}`,
      event.row.id,
    ]);
  }

  redirectToShow(event: TableEvent<Liquidacion>): void {
    this.router.navigate([
      `/estado-cuenta/${m.LIQUIDACION}/${a.VER}`,
      event.row.id,
    ]);
  }

  deleteRow(event: TableEvent<Liquidacion>): void {
    const row = event.row;
    const message = `¿Está seguro que desea eliminar la liquidación Nº ${row.id}?`;
    confirmationDialogToDelete(
      this.dialog,
      message,
      this.liquidacionService,
      row.id,
      this.snackbar,
      {
        next: () => {
          this.getList();
        },
      }
    );
  }

  downloadFile(): void {
    this.liquidacionService
      .generateReportsByEstadoCuenta(this.estadoCuenta!, this.estado!)
      .subscribe((filename) => {
        this.reportsService.downloadFile(filename).subscribe((file) => {
          saveAs(file, filename);
        });
      });
  }

  private getData(): void {
    const {
      backUrl,
      estado,
      contraparte,
      contraparte_numero_documento,
      tipo_contraparte_id,
    } = this.route.snapshot.queryParams;
    if (backUrl) {
      this.backUrl = backUrl;
    }
    this.estado = estado;
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
      .getListByEstadoCuenta(this.estadoCuenta!, this.estado!)
      .subscribe((data) => {
        this.credito = data.reduce((acc, cur) => acc + cur.credito, 0);
        this.debito = data.reduce((acc, cur) => acc + cur.debito, 0);
        this.list = data;
        this.movimientosSelected = [];
      });
  }
}
