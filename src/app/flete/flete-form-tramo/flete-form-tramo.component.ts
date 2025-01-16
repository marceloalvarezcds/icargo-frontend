import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { CentroOperativo, CentroOperativoList } from 'src/app/interfaces/centro-operativo';
import { Flete } from 'src/app/interfaces/flete';

@Component({
  selector: 'app-flete-form-tramo',
  templateUrl: './flete-form-tramo.component.html',
  styleUrls: ['./flete-form-tramo.component.scss'],
})
export class FleteFormTramoComponent implements OnInit {
  groupName = 'tramo';

  @Input() form?: FormGroup;
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() flete?: Flete;

  @Output() destinoChange = new EventEmitter<CentroOperativo | undefined>();
  @Output() origenChange = new EventEmitter<CentroOperativo | undefined>();

  origenEventsSubject: Subject<CentroOperativoList> = new Subject<CentroOperativoList>();
  destinoEventsSubject: Subject<CentroOperativoList> = new Subject<CentroOperativoList>();

  get origenCentroOperativo(): CentroOperativoList | undefined {
    let value = this.flete?.origen as CentroOperativoList;
    return value;
  }

  get destinoCentroOperativo(): CentroOperativoList | undefined {
    let value = this.flete?.destino as CentroOperativoList;
    return value;
  }

  ngOnInit(){

    if (this.isEdit || this.isShow) {

      this.form?.get(this.groupName)?.get('origen_id')?.valueChanges
        .pipe(
          //debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((value) => {

          if (value) {
            // Solo una vez se debe actualizar vista al editar
            setTimeout(() => {
              this.origenEventsSubject.next(this.origenCentroOperativo);
            }, 500);

          }

        });

        this.form?.get(this.groupName)?.get('destino_id')?.valueChanges
        .pipe(
          //debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((value) => {

          if (value) {
            // Solo una vez se debe actualizar vista al editar
            setTimeout(() => {
              this.destinoEventsSubject.next(this.destinoCentroOperativo);
            }, 500);

          }

        });

      }

  }
}
