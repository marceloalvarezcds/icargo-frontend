import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { Combinacion } from 'src/app/interfaces/combinacion';
import { PropietarioList } from 'src/app/interfaces/propietario';

import { Semi } from 'src/app/interfaces/semi';

@Component({
  selector: 'app-semi-form-info',
  templateUrl: './semi-form-info.component.html',
  styleUrls: ['./semi-form-info.component.scss'],
})
export class SemiFormInfoComponent implements OnInit {
  groupName = 'info';
  fotoFile: File | null = null;

  @Input() combinacion?: Combinacion;
  @Input() propietarioId?: number;
  @Input() form?: FormGroup;
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() estado = EstadoEnum.PENDIENTE;
  @Input() foto: string | null = null;
  @Input() semi?: Semi;

  @Output() fotoChange = new EventEmitter<File | null>();

  propietarioEventsSubject: Subject<PropietarioList> = new Subject<PropietarioList>();

  // TODO: implementar busqueda back de propietariolist si es necesario
  get ropietarioList():PropietarioList {
    let p = this.semi?.propietario as PropietarioList;
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

            setTimeout(() => {
              this.propietarioEventsSubject.next(this.ropietarioList);
            }, 500);

          }

        });
    }

  }

}
