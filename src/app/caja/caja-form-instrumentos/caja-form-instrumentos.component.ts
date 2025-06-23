import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Instrumento } from 'src/app/interfaces/instrumento';
import { Caja } from 'src/app/interfaces/caja';
import { CajaService } from 'src/app/services/caja.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-caja-form-instrumentos',
  templateUrl: './caja-form-instrumentos.component.html',
  styleUrls: ['./caja-form-instrumentos.component.scss'],
})
export class CajaFormInstrumentosComponent implements OnInit {

  a = a;
  m = m;
  id!: number;
  isShow = false;
  backUrl = `/caja/${m.CAJA}/${a.LISTAR}`;
  modelo = m.CAJA;
  item?: Caja;
  hasChange = false;

  form = this.fb.group({
    nombre: null,
    moneda_id: null,
    debito: null,
    credito: null,
    saldo_confirmado: null,
  });

  initialFormValue = this.form.value;

  get gestorCargaId(): number | undefined {
    return this.item?.gestor_carga_id;
  }

  get list(): Instrumento[]{
    return this.item!.instrumentos;
  }

  columns: Column[] = [
    {
      def: 'id_caja',
      title: 'ID',
      value: (element: Instrumento) => element.id,
    },
    {
      def: 'numero_referencia_caja',
      title: 'Referencia',
      value: (element: Instrumento) => element.numero_referencia,
    },
    {
      def: 'usuario_caja',
      title: 'Usuario',
      value: (element: Instrumento) => element.created_by,
    },
    {
      def: 'fecha_instrumento_caja',
      title: 'Fecha',
      value: (element: Instrumento) => this.formatDate(element.fecha_instrumento),

    },
    {
      def: 'contraparte_caja',
      title: 'Contraparte',
      value: (element: Instrumento) => element.contraparte,
    },
    {
      def: 'tipo_contraparte',
      title: 'Tipo Contraparte',
      value: (element: Instrumento) => element.tipo_contraparte_descripcion,
    },
    {
      def: 'id_liq_caja',
      title: 'ID liq.',
      value: (element: Instrumento) => element.liquidacion_id,
    },
    {
      def: 'tipo_operacion_descripcion',
      title: 'Operación',
      value: (element: Instrumento) => element.tipo_operacion_descripcion,
    },
    {
      def: 'credito_caja_instrumento',
      title: 'Crédito',
      value: (element: Instrumento) => element.credito,
      type: 'number',
    },
    {
      def: 'debito_caja_instrumento',
      title: 'Débito',
      value: (element: Instrumento) => element.debito,
      type: 'number',
    },
    {
      def: 'saldo_caja',
      title: 'Saldo',
      value: (element: Instrumento) => element.saldo_confirmado,
      type: 'number',
    },

  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: SnackbarService,
    private cajaService: CajaService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  back(confirmed: boolean): void {
    this.router.navigate([this.backUrl]);
  }

  private getData(): void {
    const backUrl = this.route.snapshot.queryParams.backUrl;
    if (backUrl) {
      this.backUrl = backUrl;
    }
    this.id = +this.route.snapshot.params.id;

    if (this.id) {
      this.isShow = true;
      this.cajaService.getById(this.id).subscribe((data) => {
        this.item = data;
        this.form.patchValue({
          nombre: data.nombre,
          moneda_id: data.moneda_id,
          debito: data.debito,
          credito: data.credito,
          saldo_confirmado: data.saldo_confirmado
        });
        this.form.disable();
        setTimeout(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
        }, 500);
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }


}

