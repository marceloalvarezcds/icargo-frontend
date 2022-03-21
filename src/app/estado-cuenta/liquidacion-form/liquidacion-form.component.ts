import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LiquidacionConfirmDialogComponent } from 'src/app/dialogs/liquidacion-confirm-dialog/liquidacion-confirm-dialog.component';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { LiquidacionConfirmDialogData } from 'src/app/interfaces/liquidacion-confirm-dialog-data';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { CheckboxEvent } from 'src/app/interfaces/table';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { MovimientoService } from 'src/app/services/movimiento.service';

@Component({
  selector: 'app-liquidacion-form',
  templateUrl: './liquidacion-form.component.html',
  styleUrls: ['./liquidacion-form.component.scss'],
})
export class LiquidacionFormComponent implements OnInit {
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº de Movimiento',
      value: (element: Movimiento) => element.id,
      type: 'checkbox',
      sticky: true,
    },
    {
      def: 'monto',
      title: 'Monto',
      value: (element: Movimiento) => element.monto,
      type: 'number',
    },
    {
      def: 'concepto',
      title: 'Concepto',
      value: (element: Movimiento) => element.concepto,
    },
    {
      def: 'cuenta_descripcion',
      title: 'Cuenta',
      value: (element: Movimiento) => element.cuenta_descripcion,
    },
    {
      def: 'detalle',
      title: 'Detalle',
      value: (element: Movimiento) => element.detalle,
    },
    {
      def: 'tipo_documento_relacionado_descripcion',
      title: 'Tipo de Doc Relacionado',
      value: (element: Movimiento) =>
        element.tipo_documento_relacionado_descripcion,
    },
    {
      def: 'numero_documento_relacionado',
      title: 'Nº Doc Relacionado',
      value: (element: Movimiento) => element.numero_documento_relacionado,
    },
    {
      def: 'moneda_nombre',
      title: 'Moneda',
      value: (element: Movimiento) => element.moneda_nombre,
    },
    {
      def: 'tipo_cambio_moneda',
      title: 'Tipo de Cambio',
      value: (element: Movimiento) => element.tipo_cambio_moneda,
      type: 'number',
    },
    {
      def: 'fecha_cambio_moneda',
      title: 'Fecha de cambio',
      value: (element: Movimiento) => element.fecha_cambio_moneda,
      type: 'date',
    },
    {
      def: 'monto_ml',
      title: 'Monto (ML)',
      value: (element: Movimiento) => element.monto_ml,
      type: 'number',
    },
    {
      def: 'created_at',
      title: 'Fecha y hora',
      value: (element: Movimiento) => element.created_at,
      type: 'date',
    },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: Movimiento) => element.created_by,
    },
    {
      def: 'ver',
      title: '',
      type: 'button',
      value: () => 'Ver OC',
      isHidden: (mov: Movimiento) =>
        mov.tipo_documento_relacionado_descripcion === 'OC',
      buttonCallback: (element: Movimiento) => this.redirectToShowOC(element),
      stickyEnd: true,
    },
  ];

  form = new FormGroup({});
  credito = 0;
  debito = 0;
  backUrl = `/estado-cuenta/${m.ESTADO_CUENTA}/${a.LISTAR}`;
  modelo = m.LIQUIDACION;
  estado?: EstadoEnum;
  estadoCuenta?: EstadoCuenta;
  list: Movimiento[] = [];
  movimientosSelected: Movimiento[] = [];

  get saldo(): number {
    return this.credito - this.debito;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private estadoCuentaService: EstadoCuentaService,
    private liquidacionService: LiquidacionService,
    private movimientoService: MovimientoService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  back(save: boolean): void {
    if (save) {
      this.submit(save);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  confirm(): void {
    if (this.movimientosSelected.length) {
      const data: LiquidacionConfirmDialogData = {
        estadoCuenta: this.estadoCuenta!,
        list: this.movimientosSelected,
        credito: this.credito,
        debito: this.debito,
      };
      this.dialog
        .open(LiquidacionConfirmDialogComponent, {
          data,
          panelClass: 'full-dialog',
        })
        .afterClosed()
        .pipe(filter((confirmed) => !!confirmed))
        .subscribe(() => {
          this.submit(false);
        });
    } else {
      this.snackbar.open('Debe elegir al menos 1 movimiento', 'Ok');
    }
  }

  onAllCheckedChange(checked: boolean): void {
    if (checked) {
      this.credito = this.list.reduce((acc, cur) => acc + cur.credito, 0);
      this.debito = this.list.reduce((acc, cur) => acc + cur.debito, 0);
    } else {
      this.credito = 0;
      this.debito = 0;
    }
  }

  onCheckboxChange(event: CheckboxEvent<Movimiento>): void {
    const movimiento = event.value.row;
    if (event.event.checked) {
      this.credito += movimiento.credito;
      this.debito += movimiento.debito;
      this.movimientosSelected.push(movimiento);
    } else {
      this.credito -= movimiento.credito;
      this.debito -= movimiento.debito;
      this.movimientosSelected = this.movimientosSelected.filter(
        (m) => m.id !== movimiento.id
      );
    }
  }

  private submit(confirmed: boolean): void {
    if (this.movimientosSelected.length) {
      const formData = new FormData();
      formData.append(
        'data',
        JSON.stringify({ movimientos: this.movimientosSelected })
      );
      this.liquidacionService.create(formData).subscribe(() => {
        this.snackbar
          .open('Datos guardados satisfactoriamente', 'Ok')
          .afterDismissed()
          .subscribe(() => {
            if (confirmed) {
              this.router.navigate([this.backUrl]);
            } else {
              this.getData();
            }
          });
      });
    } else {
      this.snackbar.open('Debe elegir al menos 1 movimiento', 'Ok');
    }
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
    this.movimientoService
      .getListByEstadoCuenta(this.estadoCuenta!, this.estado!)
      .subscribe((data) => {
        this.credito = 0;
        this.debito = 0;
        this.list = data;
        this.movimientosSelected = [];
      });
  }

  private redirectToShowOC(mov: Movimiento): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/orden-carga/${m.ORDEN_CARGA}/${a.VER}`,
        mov.numero_documento_relacionado,
      ])
    );
    window.open(url, '_blank');
  }
}
