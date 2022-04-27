import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Instrumento } from 'src/app/interfaces/instrumento';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { getQueryParams } from 'src/app/utils/contraparte-info';

@Component({
  selector: 'app-liquidacion-confirmada-form',
  templateUrl: './liquidacion-confirmada-form.component.html',
  styleUrls: ['./liquidacion-confirmada-form.component.scss'],
})
export class LiquidacionConfirmadaFormComponent implements OnInit {
  E = EstadoEnum;
  form = new FormGroup({});
  backUrl = `/estado-cuenta/${m.LIQUIDACION}/${a.LISTAR}`;
  modelo = m.LIQUIDACION;
  id?: number;
  item?: Liquidacion;
  isEdit = false;
  movimientos: Movimiento[] = [];
  residuo = 0;
  valorInstrumentos = 0;

  get gestorCargaId(): number | undefined {
    return this.item?.gestor_carga_id;
  }

  get isShow(): boolean {
    return !this.isEdit;
  }

  get comentario(): string {
    return this.item?.comentarios ?? '';
  }

  get credito(): number {
    return this.movimientos.reduce((acc, cur) => acc + cur.credito, 0);
  }

  get debito(): number {
    return this.movimientos.reduce((acc, cur) => acc + cur.debito, 0);
  }

  get instrumentos(): Instrumento[] {
    return this.item?.instrumentos ?? [];
  }

  get saldo(): number {
    return this.credito - this.debito;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private liquidacionService: LiquidacionService,
    private movimientoService: MovimientoService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  back(): void {
    this.router.navigate([this.backUrl], {
      queryParams: getQueryParams(this.item!, this.item!.etapa),
    });
  }

  redirectToEdit(): void {
    const id = this.id!;
    this.router.navigate(
      [`/estado-cuenta/${m.LIQUIDACION}/${a.EDITAR}/${id}`],
      {
        queryParams: {
          backUrl: `/estado-cuenta/${m.LIQUIDACION}/${a.VER}/${id}`,
        },
      }
    );
  }

  loadLiquidacion(): void {
    this.liquidacionService.getById(this.id!).subscribe((item) => {
      this.item = item;
      this.residuo = item.saldo_residual;
      this.valorInstrumentos = item.instrumentos_saldo;
      this.getList(item);
    });
  }

  private getData(): void {
    const { backUrl } = this.route.snapshot.queryParams;
    this.id = +this.route.snapshot.params.id;
    this.isEdit = /edit/.test(this.router.url);
    if (backUrl) {
      this.backUrl = backUrl;
    }
    this.loadLiquidacion();
  }

  private getList(liq: Liquidacion): void {
    this.movimientoService
      .getListByLiquidacion(liq, LiquidacionEtapaEnum.CONFIRMADO)
      .subscribe((data) => {
        this.movimientos = data;
      });
  }
}
