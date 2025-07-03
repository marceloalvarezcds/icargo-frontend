import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { OperacionEstadoEnum } from 'src/app/enums/operacion-estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Banco } from 'src/app/interfaces/banco';
import { Column } from 'src/app/interfaces/column';
import { Instrumento } from 'src/app/interfaces/instrumento';
import { TableEvent } from 'src/app/interfaces/table';
import { BancoService } from 'src/app/services/banco.service';
import { DialogService } from 'src/app/services/dialog.service';
import { InstrumentoService } from 'src/app/services/instrumento.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-banco-form-instrumentos',
  templateUrl: './banco-form-instrumentos.component.html',
  styleUrls: ['./banco-form-instrumentos.component.scss'],
})
export class BancoFormInstrumentosComponent implements OnInit {

  a = a;
  m = m;
  id!: number;
  isShow = false;
  backUrl = `/banco/${m.BANCO}/${a.LISTAR}`;
  modelo = m.BANCO;
  item?: Banco;
  hasChange = false;

  form = this.fb.group({
    numero_cuenta: [null],
    titular: [null],
    nombre: [null],
    moneda_id: [null],
    credito: null,
    debito: null,
    saldo_provisional: null
  })

  initialFormValue = this.form.value;

  get gestorCargaId(): number | undefined {
    return this.item?.gestor_carga_id;
  }

  get list(): Instrumento[]{

    if (this.item)
      return this.item?.instrumentos;
    else return []
  }

  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: Instrumento) => element.id,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: Instrumento) => element.operacion_estado.toUpperCase(),
    },
    {
      def: 'numero_referencia',
      title: 'Referencia',
      value: (element: Instrumento) => element.numero_referencia,
    },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: Instrumento) => element.created_by,
    },
    {
      def: 'fecha_instrumento',
      title: 'Fecha',
      value: (element: Instrumento) => this.formatDate(element.fecha_instrumento),
    },
    {
      def: 'id_liq',
      title: 'ID liq.',
      value: (element: Instrumento) => element.liquidacion_id,
    },
    {
      def: 'tipo_operacion_descripcion',
      title: 'Operación',
      value: (element: Instrumento) => element.tipo_operacion_descripcion,
    },
    {
      def: 'vencimiento',
      title: 'Vencimiento',
      value: (element: Instrumento) => element.cheque_fecha_vencimiento ? this.formatDate(element.cheque_fecha_vencimiento) : '',

    },
    {
      def: 'credito',
      title: 'Crédito',
      value: (element: Instrumento) => element.credito,
      type: 'number',
    },
    {
      def: 'debito',
      title: 'Débito',
      value: (element: Instrumento) => element.debito,
      type: 'number',
    },
    {
      def: 'provision',
      title: 'Pendiente',
      value: (element: Instrumento) => element.provision,
      type: 'number',
    },
    {
      def: 'saldo_provisional',
      title: 'Saldo',
      value: (element: Instrumento) => element.saldo_confirmado,
      type: 'number',
    },
    {
      def: 'contraparte',
      title: 'Contraparte',
      value: (element: Instrumento) => element.contraparte,
    },
    // {
    //   def: 'saldo_confirmado',
    //   title: 'Saldo confirmado',
    //   value: (element: Instrumento) => element.saldo_confirmado,
    //   type: 'number',
    // },
    // {
    //   def: 'provision',
    //   title: 'Provisión',
    //   value: (element: Instrumento) => element.provision,
    //   type: 'number',
    // },
    // {
    //   def: 'saldo_provisional',
    //   title: 'Saldo provisional',
    //   value: (element: Instrumento) => element.saldo_provisional,
    //   type: 'number',
    // },
    // {
    //   def: 'provision_rechazada',
    //   title: 'Provisión Rechazada',
    //   value: (element: Instrumento) => element.provision_rechazada,
    //   type: 'number',
    // },

    // {
    //   def: 'cheque_es_diferido',
    //   title: 'Es cheque diferido',
    //   value: (element: Instrumento) =>
    //     element.cheque_es_diferido ? 'Si' : 'No',
    // },
    // {
    //   def: 'cheque_fecha_vencimiento',
    //   title: 'Fecha de vencimiento del cheque',
    //   value: (element: Instrumento) => element.cheque_fecha_vencimiento,
    //   type: 'date',
    // },
    {
      def: 'confirmar',
      title: '',
      type: 'button',
      value: () => 'Confirmar',
      isDisable: (i: Instrumento) =>
        i.operacion_estado !== OperacionEstadoEnum.EMITIDO,
      buttonCallback: (element: Instrumento) => this.confirmar(element),
      stickyEnd: true,
    },
    {
      def: 'rechazar',
      title: '',
      type: 'button',
      value: () => 'Rechazar',
      isDisable: (i: Instrumento) =>
        i.operacion_estado !== OperacionEstadoEnum.EMITIDO,
      buttonCallback: (element: Instrumento) => this.rechazar(element),
      stickyEnd: true,
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: SnackbarService,
    private bancoService: BancoService,
    private userService: UserService,
    private dialog: DialogService,
    private instrumentoService: InstrumentoService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  back(confirmed: boolean): void {
    if (confirmed) {
      this.submit(confirmed);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  submit(confirmed: boolean): void {
  }

  getData(): void {
    const backUrl = this.route.snapshot.queryParams.backUrl;
    if (backUrl) {
      this.backUrl = backUrl;
    }
    this.id = +this.route.snapshot.params.id;
    if (this.id) {
      this.isShow = true;
      this.bancoService.getById(this.id).subscribe((data) => {
        this.item = data;
        this.form.patchValue({
          numero_cuenta: data.numero_cuenta,
          titular: data.titular,
          nombre: data.nombre,
          moneda_id: data.moneda_id,
          credito: data.credito,
          debito: data.debito
        });
        this.calcularTotales();
        this.form.disable();
        setTimeout(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
        }, 500);
      });
    }
  }

  calcularTotales(): void {

    const totalPendiente = this.item?.instrumentos.reduce((acc, cur) => acc + cur.provision, 0);
    this.form.patchValue({
      saldo_provisional: totalPendiente
    });


    let acumulado = 0;
    let firsPendiente = false;

    // sumatoria acumulada por grupo
    this.item?.instrumentos.reverse().forEach(element =>{

      if (element.operacion_estado === OperacionEstadoEnum.ANULADO
          || element.operacion_estado === OperacionEstadoEnum.RECHAZADO) {
        element.saldo_confirmado = 0 ;
        return;
      }

      if (!firsPendiente && element.operacion_estado === OperacionEstadoEnum.CONFIRMADO ){
        acumulado = 0;
        firsPendiente=true;
      }

      acumulado = acumulado + (element.credito - element.debito + element.provision);
      element.saldo_confirmado = acumulado ;
      return element;

    });

    this.item?.instrumentos.reverse();

  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  private confirmar(instrumento: Instrumento): void {
    const id = instrumento.id;
    const message = `¿Está seguro que desea Confirmar el instrumento Nº ${id}?`;
    this.dialog.changeStatusConfirm(
      message,
      this.instrumentoService.confirmar(id),
      () => {
        this.getData();
      }
    );
  }

  private rechazar(instrumento: Instrumento): void {
    const id = instrumento.id;
    const message = `¿Está seguro que desea Rechazar el instrumento Nº ${id}?`;
    this.dialog.changeStatusConfirm(
      message,
      this.instrumentoService.rechazar(id),
      () => {
        this.getData();
      }
    );
  }

  anularInstrumento({row}: TableEvent<Instrumento>){
    const message = `¿Está seguro que desea Instrumento ${row.id}?`;
    this.dialog.confirmationToDelete(
      message,
      this.instrumentoService.anular(row.id),
      (_) => {
        this.getData();
      }
    );

  }

  fnHideAnularRowButton(obj: Instrumento): boolean {
    return !(obj.estado === EstadoEnum.ANULADO
        || obj.operacion_estado === OperacionEstadoEnum.RECHAZADO
        || obj.operacion_estado === OperacionEstadoEnum.EMITIDO);
  }

}
