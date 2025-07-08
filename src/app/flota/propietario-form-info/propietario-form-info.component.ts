import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum,
  PermisoModeloEnum,
} from 'src/app/enums/permiso-enum';
import { TipoDocumento } from 'src/app/interfaces/tipo-documento';
import { ComposicionJuridicaService } from 'src/app/services/composicion-juridica.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';

@Component({
  selector: 'app-propietario-form-info',
  templateUrl: './propietario-form-info.component.html',
  styleUrls: ['./propietario-form-info.component.scss'],
})
export class PropietarioFormInfoComponent implements OnInit{
  a = PermisoAccionEnum;
  fotoDocumentoFile: File | null = null;
  fotoPerfilFile: File | null = null;
  isFisicaSelected = false;

  tipoDocumentoList: TipoDocumento[] = [];
  tipoDocumentoSubscription = this.tipoDocumentoService
      .getList()
      .subscribe((list) => {
        this.tipoDocumentoList = list.slice();
      });

  constructor(
        private composicionJuridicaService: ComposicionJuridicaService,
        private tipoDocumentoService: TipoDocumentoService
      ) {}

    ngOnInit(): void {
      let previousFotoFrontal: any = null;
      let previousFotoReverso: any = null;
      this.form.get('info.ruc')?.valueChanges.subscribe(value => {
        if (this.form.get('info.es_chofer')?.value) {
          this.form.get('chofer.numero_documento')?.setValue(value, { emitEvent: false });
        }
      });

      this.form.get('info.tipo_documento_propietario_id')?.valueChanges.subscribe(value => {
        if (this.form.get('info.es_chofer')?.value) {
          this.form.get('chofer.tipo_documento_id')?.setValue(value, { emitEvent: false });
        }
      });

      this.form.get('info.foto_documento_frente')?.valueChanges.subscribe(value => {
        if (this.form.get('info.es_chofer')?.value) {
          this.form.get('chofer.foto_documento_frente_chofer')?.setValue(value, { emitEvent: false });
        } else {
          previousFotoFrontal = value;
        }
      });

      this.form.get('info.foto_documento_reverso')?.valueChanges.subscribe(value => {
        if (this.form.get('info.es_chofer')?.value) {
          this.form.get('chofer.foto_documento_reverso_chofer')?.setValue(value, { emitEvent: false });
        } else {
          previousFotoReverso = value;
        }
      });

      this.form.get('info.pais_origen_id')?.valueChanges.subscribe(value => {
        if (this.form.get('info.es_chofer')?.value) {
          this.form.get('chofer.pais_emisor_documento_id')?.setValue(value, { emitEvent: false });
        }
      });

      this.form.get('info.es_chofer')?.valueChanges.subscribe(esChofer => {
        if (!esChofer) {
          this.form.get('chofer.numero_documento')?.reset();
          this.form.get('chofer.tipo_documento_id')?.reset();
          this.form.get('chofer.foto_documento_frente_chofer')?.reset();
          this.form.get('chofer.foto_documento_reverso_chofer')?.reset();
          this.form.get('chofer.pais_emisor_documento_id')?.reset();
        } else {
          if (previousFotoFrontal !== null) {
            this.form.get('chofer.foto_documento_frente_chofer')?.setValue(previousFotoFrontal, { emitEvent: false });
          }
          if (previousFotoReverso !== null) {
            this.form.get('chofer.foto_documento_reverso_chofer')?.setValue(previousFotoReverso, { emitEvent: false });
          }

          const ruc = this.form.get('info.ruc')?.value;
          if (ruc) {
            this.form.get('chofer.numero_documento')?.setValue(ruc, { emitEvent: false });
          }
          const tipoDocumento = this.form.get('info.tipo_documento_propietario_id')?.value;
          if (tipoDocumento) {
            this.form.get('chofer.tipo_documento_id')?.setValue(tipoDocumento, { emitEvent: false });
          }

          const paisOrigenId = this.form.get('info.pais_origen_id')?.value;
          if (paisOrigenId) {
            this.form.get('chofer.pais_emisor_documento_id')?.setValue(paisOrigenId, { emitEvent: false });
          }
        }
      });
    }



  @Input() form = new FormGroup({
    info: new FormGroup({
      nombre: new FormControl(null),
      // tipo_persona_id: new FormControl(null),
      ruc: new FormControl(null),
      // digito_verificador: new FormControl(null),
      pais_origen_id: new FormControl(null),
      fecha_nacimiento: new FormControl(null),
      oficial_cuenta_id: new FormControl(null),
      // alias: new FormControl(null),
      foto_documento_frente: new FormControl(null),
      foto_documento_reverso: new FormControl(null),
      foto_perfil: new FormControl(null),
      es_chofer: new FormControl(false),
      telefono: new FormControl(null),
      email: new FormControl(null),
      puede_recibir_anticipos: new FormControl(null),
      composicion_juridica_id: new FormControl(null),
      nombre_corto: new FormControl(null),
      tipo_documento_propietario_id: new FormControl(null),
    }),
    chofer: new FormGroup({
      tipo_documento_id: new FormControl(null),
      numero_documento: new FormControl(null),
    })
  });
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() estado = EstadoEnum.PENDIENTE;
  @Input() fotoDocumentoFrente: string | null = null;
  @Input() fotoDocumentoReverso: string | null = null;
  @Input() fotoPerfil: string | null = null;
  @Input() modelo?: PermisoModeloEnum;
  @Input() gestorCuentaId?: number;
  @Input() cantidadOCConAnticiposLiberados = 0;

  @Output() esChoferChange = new EventEmitter<boolean>();
  @Output() fotoDocumentoFrenteChange = new EventEmitter<File | null>();
  @Output() fotoDocumentoReversoChange = new EventEmitter<File | null>();
  @Output() fotoPerfilChange = new EventEmitter<File | null>();
  @Output() anticiposBloqueadosChange = new EventEmitter();
  @Output() isPropietarioCondicionadoChange = new EventEmitter();

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  get esChoferControl(): FormControl {
    return this.info.controls['es_chofer'] as FormControl;
  }

  get puedeRecibirAnticiposControl(): FormControl {
    return this.info.controls['puede_recibir_anticipos'] as FormControl;
  }

  get isPropietarioCondicionadoControl(): FormControl {
    return this.info.controls['is_propietario_condicionado'] as FormControl;
  }

  get contactos(): FormArray | null {
    return this.form.get('contactos') as FormArray;
  }

  isFisicaChange(isFisica: boolean): void {
    this.isFisicaSelected = isFisica;
    if (!isFisica) {
      this.esChoferControl.setValue(isFisica);
      // Se quita validador de contactos al editar 2024-12-13
      //this.contactos?.setValidators(Validators.required);
    } else {
      this.contactos?.removeValidators(Validators.required);
    }
    this.contactos?.updateValueAndValidity();
  }

}
