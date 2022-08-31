import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import {
  Instrumento,
  InstrumentoLiquidacionItem,
} from 'src/app/interfaces/instrumento';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { ReportsService } from 'src/app/services/reports.service';
import { getQueryParams } from 'src/app/utils/contraparte-info';

@Component({
  selector: 'app-liquidacion-confirmada-form',
  templateUrl: './liquidacion-confirmada-form.component.html',
  styleUrls: ['./liquidacion-confirmada-form.component.scss'],
})
export class LiquidacionConfirmadaFormComponent implements OnInit {
  E = EstadoEnum;
  form = new FormGroup({});
  confirmado = LiquidacionEtapaEnum.CONFIRMADO.toLowerCase();
  backUrl = `/estado-cuenta/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.LISTAR}`;
  modelo = m.LIQUIDACION;
  id?: number;
  item?: Liquidacion;
  isEdit = false;
  movimientos: Movimiento[] = [];
  instrumentoInMemoryList: InstrumentoLiquidacionItem[] = [];
  contraparte_id = 0;
  actual_contraparte = '';
  actual_contraparte_numero_documento = '';
  residuo = 0;
  saldo = 0;
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

  get instrumentos(): Instrumento[] {
    return this.item?.instrumentos ?? [];
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
    const contraparte_id = this.contraparte_id;
    const contraparte = this.actual_contraparte;
    const contraparte_numero_documento =
      this.actual_contraparte_numero_documento;
    this.router.navigate([this.backUrl], {
      queryParams: getQueryParams(
        {
          ...this.item!,
          contraparte_id,
          contraparte,
          contraparte_numero_documento,
        },
        this.item!.etapa
      ),
    });
  }

  redirectToEdit(): void {
    const id = this.id!;
    this.router.navigate(
      [
        `/estado-cuenta/${m.ESTADO_CUENTA}/${this.confirmado}/${m.LIQUIDACION}/${a.EDITAR}/${id}`,
      ],
      {
        queryParams: {
          backUrl: `/estado-cuenta/${m.ESTADO_CUENTA}/${this.confirmado}/${m.LIQUIDACION}/${a.VER}/${id}`,
          contraparte_id: this.contraparte_id,
          actual_contraparte: this.actual_contraparte,
          actual_contraparte_numero_documento:
            this.actual_contraparte_numero_documento,
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

  downloadFile(): void {
    this.movimientoService
      .generateReportsByEstadoAndLiquidacionId(
        LiquidacionEtapaEnum.CONFIRMADO,
        this.id!
      )
      .subscribe((filename) => {
        this.reportsService.downloadFile(filename).subscribe((file) => {
          saveAs(file, filename);
        });
      });
  }

  downloadPDF(): void {
    this.liquidacionService
      .pdf(this.id!, LiquidacionEtapaEnum.CONFIRMADO)
      .subscribe((filename) => {
        this.reportsService.downloadFile(filename).subscribe((file) => {
          saveAs(file, filename);
        });
      });
  }

  private getData(): void {
    const {
      backUrl,
      contraparte_id,
      actual_contraparte,
      actual_contraparte_numero_documento,
    } = this.route.snapshot.queryParams;
    this.id = +this.route.snapshot.params.id;
    this.contraparte_id = contraparte_id;
    this.actual_contraparte = actual_contraparte;
    this.actual_contraparte_numero_documento =
      actual_contraparte_numero_documento;
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
