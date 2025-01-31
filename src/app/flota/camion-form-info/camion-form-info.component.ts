import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { Camion } from 'src/app/interfaces/camion';
import { Combinacion } from 'src/app/interfaces/combinacion';
import { PropietarioList } from 'src/app/interfaces/propietario';

@Component({
  selector: 'app-camion-form-info',
  templateUrl: './camion-form-info.component.html',
  styleUrls: ['./camion-form-info.component.scss'],
})
export class CamionFormInfoComponent implements OnInit {

  ACTIVO = EstadoEnum.ACTIVO;
  groupName = 'info';
  fotoFile: File | null = null;

  @Input() combinacion?: Combinacion;
  @Input() propietarioId?: number;
  @Input() tractoId?: number;
  @Input() form?: FormGroup;
  @Input() camion?: Camion;
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() estado = EstadoEnum.PENDIENTE;
  @Input() foto: string | null = null;

  @Output() fotoChange = new EventEmitter<File | null>();

  propietarioEventsSubject: Subject<PropietarioList> = new Subject<PropietarioList>();

  // TODO: implementar busqueda back de propietariolist si es necesario
  get ropietarioList():PropietarioList {
    let p = this.camion?.propietario as PropietarioList;
    p.info = p.nombre + " - " + ( p.numero_documento ?? p.ruc);
    return p;
  }

  ngOnInit(){

    if (this.isEdit || this.isShow){

      this.form?.get(this.groupName)?.get('propietario_id')?.valueChanges
        .pipe(
          //debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((value) => {

          if (value) {
            // Solo una vez se debe actualizar vista al editar
            setTimeout(() => {
              this.propietarioEventsSubject.next(this.ropietarioList);
            }, 500);

          }

        });
    }

  }

}
