import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { getQueryParams } from 'src/app/utils/contraparte-info';

@Component({
  selector: 'app-liquidacion-edit-form',
  templateUrl: './liquidacion-edit-form.component.html',
  styleUrls: ['./liquidacion-edit-form.component.scss'],
})
export class LiquidacionEditFormComponent implements OnInit {
  E = EstadoEnum;
  form = new FormGroup({});
  backUrl = `/estado-cuenta/${m.LIQUIDACION}/${a.LISTAR}`;
  modelo = m.LIQUIDACION;
  id?: number;
  item?: Liquidacion;
  isEdit = false;
  movimientos: Movimiento[] = [];

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

  get saldo(): number {
    return this.credito - this.debito;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private liquidacionService: LiquidacionService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  back(): void {
    this.router.navigate([this.backUrl], {
      queryParams: getQueryParams(this.item!, this.item!.etapa),
    });
  }

  changeMovimientoList(): void {
    this.loadLiquidacion();
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

  private getData(): void {
    const { backUrl } = this.route.snapshot.queryParams;
    this.id = +this.route.snapshot.params.id;
    this.isEdit = /edit/.test(this.router.url);
    if (backUrl) {
      this.backUrl = backUrl;
    }
    this.loadLiquidacion();
  }

  private loadLiquidacion(): void {
    this.liquidacionService.getById(this.id!).subscribe((item) => {
      this.item = item;
      this.movimientos = item.movimientos;
    });
  }
}
