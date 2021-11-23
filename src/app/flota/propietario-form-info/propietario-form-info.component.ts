import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { PermisoAccionEnum, PermisoModeloEnum } from 'src/app/enums/permiso-enum';
import { FileChangeEvent } from 'src/app/interfaces/file-change-event';
import { TipoPersona } from 'src/app/interfaces/tipo-persona';
import { User } from 'src/app/interfaces/user';
import { PaisService } from 'src/app/services/pais.service';
import { TipoPersonaService } from 'src/app/services/tipo-persona.service';
import { UserService } from 'src/app/services/user.service';
import { isFisica } from 'src/app/utils/tipo-persona';

@Component({
  selector: 'app-propietario-form-info',
  templateUrl: './propietario-form-info.component.html',
  styleUrls: ['./propietario-form-info.component.scss']
})
export class PropietarioFormInfoComponent implements OnDestroy {

  a = PermisoAccionEnum;
  fotoDocumentoFile: File | null = null;
  fotoPerfilFile: File | null = null;

  paisList$ = this.paisService.getList();
  tipoPersonaList: TipoPersona[] = [];
  tipoPersonaSubscription = this.tipoPersonaService.getList().subscribe(list => {
    this.tipoPersonaList = list.slice();
  });
  userList$ = this.userService.getListByGestorCargaId();

  @Input() form = new FormGroup({
    info: new FormGroup({
      nombre: new FormControl(null),
      tipo_persona_id: new FormControl(null),
      ruc: new FormControl(null),
      digito_verificador: new FormControl(null),
      pais_origen_id: new FormControl(null),
      fecha_nacimiento: new FormControl(null),
      oficial_cuenta_id: new FormControl(null),
      alias: new FormControl(null),
      foto_documento: new FormControl(null),
      foto_perfil: new FormControl(null),
      es_chofer: new FormControl(false),
      telefono: new FormControl(null),
      email: new FormControl(null),
    }),
  });
  @Input() isShow = false;
  @Input() fotoDocumento: string | null = null;
  @Input() fotoPerfil: string | null = null;
  @Input() user?: User;
  @Input() modelo?: PermisoModeloEnum;
  @Input() gestorCuentaId?: number;

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  get esChofer(): boolean {
    return !!this.info.controls['es_chofer'].value;
  }

  get fotoDocumentoControl(): FormControl {
    return this.info.get('foto_documento') as FormControl;
  }

  get fotoPerfilControl(): FormControl {
    return this.info.get('foto_perfil') as FormControl;
  }

  get isFisicaSelected(): boolean {
    return isFisica(this.tipoPersonaList, this.info.controls['tipo_persona_id'].value);
  }

  constructor(
    private paisService: PaisService,
    private tipoPersonaService: TipoPersonaService,
    private userService: UserService,
  ) { }

  ngOnDestroy(): void {
    this.tipoPersonaSubscription.unsubscribe();
  }

  fotoDocumentoChange(fotoDocumentoEvent: FileChangeEvent): void {
    this.fotoDocumento = null;
    this.fotoDocumentoFile = fotoDocumentoEvent.target!.files!.item(0);
    this.fotoDocumentoControl.setValue(this.fotoDocumentoFile?.name);
  }

  fotoPerfilChange(fotoPerfilEvent: FileChangeEvent): void {
    this.fotoPerfil = null;
    this.fotoPerfilFile = fotoPerfilEvent.target!.files!.item(0);
    this.fotoPerfilControl.setValue(this.fotoPerfilFile?.name);
  }

  tipoPersonaIdChange(event: MatSelectChange): void {
    if (!isFisica(this.tipoPersonaList, event.value)) {
      this.info.controls['es_chofer'].setValue(false);
    }
  }
}
