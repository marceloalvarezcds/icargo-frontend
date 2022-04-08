import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { MovimientoService } from 'src/app/services/movimiento.service';

@Component({
  selector: 'app-liquidacion-finalizada',
  templateUrl: './liquidacion-finalizada.component.html',
  styleUrls: ['./liquidacion-finalizada.component.scss'],
})
export class LiquidacionFinalizadaComponent implements OnInit {
  E = EstadoEnum;
  form = new FormGroup({});
  estadoCuenta?: EstadoCuenta;
  etapa?: LiquidacionEtapaEnum;
  backUrl = `/estado-cuenta/${m.ESTADO_CUENTA}/${a.LISTAR}`;
  movimientos: Movimiento[] = [];

  get credito(): number {
    return this.movimientos.reduce((acc, cur) => acc + cur.credito, 0);
  }

  get debito(): number {
    return this.movimientos.reduce((acc, cur) => acc + cur.debito, 0);
  }

  get saldo(): number {
    return this.credito - this.debito;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private estadoCuentaService: EstadoCuentaService,
    private movimientoService: MovimientoService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  back(): void {
    this.router.navigate([this.backUrl]);
  }

  private getData(): void {
    const {
      backUrl,
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
        LiquidacionEtapaEnum.FINALIZADO
      )
      .subscribe((data) => {
        this.movimientos = data;
      });
  }
}
