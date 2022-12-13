import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { filter } from 'rxjs/operators';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModeloEnum,
} from 'src/app/enums/permiso-enum';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { subtract } from 'src/app/utils/math';
import { ReportsService } from 'src/app/services/reports.service';
import { getQueryParams } from 'src/app/utils/contraparte-info';
import { ActivatedRouteService } from 'src/app/services/activated-route.service';

@Component({
  selector: 'app-liquidacion-finalizada',
  templateUrl: './liquidacion-finalizada.component.html',
  styleUrls: ['./liquidacion-finalizada.component.scss'],
})
export class LiquidacionFinalizadaComponent implements OnInit {
  E = EstadoEnum;
  m = PermisoModeloEnum;
  form = new FormGroup({});
  estadoCuenta?: EstadoCuenta;
  etapa?: LiquidacionEtapaEnum;
  backUrl = `/estado-cuenta/${m.ESTADO_CUENTA}/${a.LISTAR}`;
  movimientos: Movimiento[] = [];

  get esFinalizado(): boolean {
    return this.etapa === LiquidacionEtapaEnum.FINALIZADO;
  }

  get credito(): number {
    return this.movimientos.reduce((acc, cur) => acc + cur.credito, 0);
  }

  get debito(): number {
    return this.movimientos.reduce((acc, cur) => acc + cur.debito, 0);
  }

  get saldo(): number {
    return subtract(this.credito, this.debito);
  }

  constructor(
    private router: Router,
    private route: ActivatedRouteService,
    private estadoCuentaService: EstadoCuentaService,
    private movimientoService: MovimientoService,
    private reportsService: ReportsService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  back(): void {
    this.router.navigate([this.backUrl]);
  }

  downloadFile(): void {
    this.movimientoService
      .generateReportsByContraparte(
        this.estadoCuenta!,
        this.estadoCuenta!.contraparte_id,
        this.etapa!
      )
      .subscribe((filename) => {
        this.reportsService.downloadFile(filename).subscribe((file) => {
          saveAs(file, filename);
        });
      });
  }

  redirectToLiqView(): void {
    this.router.navigate(
      [`/estado-cuenta/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.LISTAR}`],
      {
        queryParams: getQueryParams(this.estadoCuenta!, this.etapa),
      }
    );
  }

  private getData(): void {
    const {
      backUrl,
      contraparte_id,
      contraparte,
      contraparte_numero_documento,
      tipo_contraparte_id,
    } = this.route.snapshot.queryParams;
    if (backUrl) {
      this.backUrl = backUrl;
    }
    this.etapa = LiquidacionEtapaEnum.FINALIZADO;
    this.estadoCuentaService
      .getByContraparte(
        tipo_contraparte_id,
        contraparte_id,
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
      .getListByEstadoCuenta(
        this.estadoCuenta!,
        this.estadoCuenta!.contraparte_id,
        LiquidacionEtapaEnum.FINALIZADO
      )
      .subscribe((data) => {
        this.movimientos = data;
      });
  }
}
