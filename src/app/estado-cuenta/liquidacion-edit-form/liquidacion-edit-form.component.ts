import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { LiquidacionEstadoEnum } from 'src/app/enums/liquidacion-estado-enum';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { ReportsService } from 'src/app/services/reports.service';
import { getQueryParams } from 'src/app/utils/contraparte-info';

@Component({
  selector: 'app-liquidacion-edit-form',
  templateUrl: './liquidacion-edit-form.component.html',
  styleUrls: ['./liquidacion-edit-form.component.scss'],
})
export class LiquidacionEditFormComponent implements OnInit {
  E = LiquidacionEstadoEnum;
  m = m;
  form = new FormGroup({});
  backUrl = `/estado-cuenta/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.LISTAR}`;
  modelo = m.LIQUIDACION;
  id?: number;
  item?: Liquidacion;
  isEdit = false;
  movimientos: Movimiento[] = [];
  actual_contraparte = '';
  actual_contraparte_numero_documento = '';
  saldo = 0;

  get gestorCargaId(): number | undefined {
    return this.item?.gestor_carga_id;
  }

  get isShow(): boolean {
    return !this.isEdit;
  }

  get comentario(): string {
    return this.item?.comentarios ?? '';
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private liquidacionService: LiquidacionService,
    private movimientoService: MovimientoService,
    private reportsService: ReportsService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  back(): void {
    const actual_contraparte = this.actual_contraparte;
    const actual_contraparte_numero_documento =
      this.actual_contraparte_numero_documento;
    this.router.navigate([this.backUrl], {
      queryParams: getQueryParams(
        {
          ...this.item!,
          actual_contraparte,
          actual_contraparte_numero_documento,
        },
        this.item!.etapa
      ),
    });
  }

  changeMovimientoList(): void {
    this.loadLiquidacion();
  }

  downloadFile(): void {
    this.movimientoService
      .generateReportsByEstadoAndLiquidacionId(
        LiquidacionEtapaEnum.EN_PROCESO,
        this.id!
      )
      .subscribe((filename) => {
        this.reportsService.downloadFile(filename).subscribe((file) => {
          saveAs(file, filename);
        });
      });
  }

  redirectToEdit(): void {
    const id = this.id!;
    this.router.navigate(
      [`/estado-cuenta/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.EDITAR}/${id}`],
      {
        queryParams: {
          backUrl: `/estado-cuenta/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.VER}/${id}`,
        },
      }
    );
  }

  private getData(): void {
    const { backUrl, actual_contraparte, actual_contraparte_numero_documento } =
      this.route.snapshot.queryParams;
    this.id = +this.route.snapshot.params.id;
    this.actual_contraparte = actual_contraparte;
    this.actual_contraparte_numero_documento =
      actual_contraparte_numero_documento;
    this.isEdit = /edit/.test(this.router.url);
    if (backUrl) {
      this.backUrl = backUrl;
    }
    this.loadLiquidacion();
  }

  private loadLiquidacion(): void {
    this.liquidacionService.getById(this.id!).subscribe((item) => {
      this.item = item;
      this.getList(item);
    });
  }

  private getList(liq: Liquidacion): void {
    this.movimientoService
      .getListByLiquidacion(liq, LiquidacionEtapaEnum.EN_PROCESO)
      .subscribe((data) => {
        this.movimientos = data;
      });
  }
}
