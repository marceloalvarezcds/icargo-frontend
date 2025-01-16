import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { OrdenCargaRemisionOrigen } from 'src/app/interfaces/orden-carga-remision-origen';
import { OrdenCargaRemisionOrigenService } from 'src/app/services/orden-carga-remision-origen.service';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';

@Component({
  selector: 'app-remision-form-dialog',
  templateUrl: './remision-form-dialog.component.html',
  styleUrls: ['./remision-form-dialog.component.scss']
})
export class RemisionFormDialogComponent implements OnInit {

  form = this.fb.group({
    nroRemitoOrigen: [this.data?.contacto_nombre, Validators.required],
    documentoFisico:[false, Validators.required],
    cantidad: {value: null, disabled: true},
    unidad_descripcion:{value: null, disabled: true},
    foto_documento: {value: null, disabled: true},
    fecha: {value: null, disabled: true},
  });

  filteredOptions: Observable<OrdenCargaRemisionOrigen[]> | undefined ;
  optionsList:OrdenCargaRemisionOrigen[] = [];
  remision:any;
  ordenCarga:any;

  get actionText(): string {
    if (this.data) {
      if (this.data.action === 'view') {
        return 'VER';
      }
      return 'EDITAR';
    }
    return 'NUEVO';
  }

  get nroRemitoOrigen():FormControl {
    return this.form.get('nroRemitoOrigen') as FormControl;
  }

  get tieneDocumentoFisico():FormControl {
    return this.form.get('documentoFisico') as FormControl;
  }

  get tieneDocumentoFisicovalue():boolean {
    return this.form.get('documentoFisico')?.value;
  }

  get isViewMode(): boolean {
    return this.data?.action === 'view';
  }

  constructor(
    public dialogRef: MatDialogRef<RemisionFormDialogComponent>,
    private ordenCargaRemisionOrigenService: OrdenCargaRemisionOrigenService,
    private ordenCargaService: OrdenCargaService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data?: any
  ) {

    if (this.data?.action === 'view') {
      this.form.disable(); // Deshabilitar el formulario si es acción "ver"
    }

  }

  ngOnInit(): void {
    this.filteredOptions = this.nroRemitoOrigen.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        //map(value => typeof value === 'string' ? value : value.name),
        switchMap(val => this.filterRemito(val))
      );
  }

  filterRemito(filter:string) : Observable<any[]> {
    return this.ordenCargaRemisionOrigenService.getListByNroRemito(filter)
      .pipe(
        map(response => {
          this.optionsList =  response.filter(
            option => { return option.numero_documento.indexOf(filter) === 0}
          )
          return this.optionsList.slice();
        }))
      ;
  }

  cargarCampoRemision(remision:any):void {

    this.remision = this.optionsList.find( x => x.numero_documento===remision);
    if (this.remision) {

      this.form.get('documentoFisico')?.disable();

      this.form.patchValue({
        cantidad: this.remision.cantidad,
        unidad_descripcion: this.remision.unidad_descripcion,
        foto_documento: this.remision.foto_documento,
        fecha: this.remision.fecha,
      });

      this.ordenCargaService.getById(this.remision.orden_carga_id).subscribe( res=> {
        this.ordenCarga = res;

        this.form.patchValue({
          documentoFisico: res.documento_fisico,
        });

        this.form.get('documentoFisico')?.enable();

      })
    }

  }

  actualizarDocumentoOC(event:MatSlideToggleChange){

    if (this.ordenCarga) {

      this.ordenCarga.documento_fisico = event.checked;
      const data = JSON.parse(
        JSON.stringify({
            ...this.ordenCarga
        })
      );

      const formData = new FormData();
      formData.append('data', JSON.stringify(data));

      this.ordenCargaService
        .edit(this.ordenCarga.id, formData)
        .subscribe((resp:any) => {

          this.form.reset();
          this.ordenCarga = null;
          this.remision = null;

        });

    }

  }

}
