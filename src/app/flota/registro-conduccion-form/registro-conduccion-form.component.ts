import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { Ciudad } from 'src/app/interfaces/ciudad';
import { FileChangeEvent } from 'src/app/interfaces/file-change-event';
import { Localidad } from 'src/app/interfaces/localidad';
import { CiudadService } from 'src/app/services/ciudad.service';
import { LocalidadService } from 'src/app/services/localidad.service';
import { PaisService } from 'src/app/services/pais.service';
import { TipoRegistroService } from 'src/app/services/tipo-registro.service';

@Component({
  selector: 'app-registro-conduccion-form',
  templateUrl: './registro-conduccion-form.component.html',
  styleUrls: ['./registro-conduccion-form.component.scss']
})
export class RegistroConduccionFormComponent implements OnDestroy {

  fotoRegistroFile: File | null = null;
  tipoRegistroList$ = this.tipoRegistroService.getList();
  paisList$ = this.paisService.getList();
  localidadList: Localidad[] = [];
  ciudadList: Ciudad[] = [];

  @Input() form = new FormGroup({
    registro: new FormGroup({
      pais_id: new FormControl(null),
      localidad_id: new FormControl(null),
      ciudad_id: new FormControl(null),
      tipo_registro_id: new FormControl(null),
      numero_registro: new FormControl(null),
      vencimiento: new FormControl(null),
      foto_registro: new FormControl(null),
    }),
  });
  @Input() fotoRegistro: string | null = null;
  @Input() isShow = false;

  get registro(): FormGroup {
    return this.form.get('registro') as FormGroup;
  }

  get paisControl(): FormControl {
    return this.registro.get('pais_id') as FormControl;
  }

  get localidadControl(): FormControl {
    return this.registro.get('localidad_id') as FormControl;
  }

  get fotoRegistroControl(): FormControl {
    return this.registro.get('foto_registro') as FormControl;
  }

  paisSubscription = this.paisControl.valueChanges.pipe(filter(v => !!v)).subscribe(paisId => {
    this.localidadService.getList(paisId).subscribe(list => {
      this.localidadList = list;
    });
  });

  localidadSubscription = this.localidadControl.valueChanges.pipe(filter(v => !!v)).subscribe(localidadId => {
    this.ciudadService.getList(localidadId).subscribe(list => {
      this.ciudadList = list;
    });
  });

  constructor(
    private ciudadService: CiudadService,
    private localidadService: LocalidadService,
    private paisService: PaisService,
    private tipoRegistroService: TipoRegistroService,
  ) { }

  ngOnDestroy(): void {
    this.paisSubscription.unsubscribe();
    this.localidadSubscription.unsubscribe();
  }

  fotoRegistroChange(fotoRegistroEvent: FileChangeEvent): void {
    this.fotoRegistro = null;
    this.fotoRegistroFile = fotoRegistroEvent.target!.files!.item(0);
    this.fotoRegistroControl.setValue(this.fotoRegistroFile?.name);
  }
}
