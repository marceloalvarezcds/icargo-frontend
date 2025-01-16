import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { Flete } from 'src/app/interfaces/flete';
import { Producto } from 'src/app/interfaces/producto';
import { Remitente, RemitenteList } from 'src/app/interfaces/remitente';

@Component({
  selector: 'app-flete-form-info',
  templateUrl: './flete-form-info.component.html',
  styleUrls: ['./flete-form-info.component.scss'],
})
export class FleteFormInfoComponent implements OnInit {

  groupName = 'info';

  @Input() flete?: Flete;
  @Input() form?: FormGroup;
  @Input() estado = EstadoEnum.PENDIENTE;
  @Input() isShow = false;
  @Input() isEdit = false;

  @Output() remitenteChange = new EventEmitter<Remitente | undefined>();
  @Output() productoChange = new EventEmitter<Producto | undefined>();

  remitenteEventsSubject: Subject<RemitenteList> = new Subject<RemitenteList>();

  get remitente(): RemitenteList | undefined {
    let value = this.flete?.remitente as RemitenteList;
    return value;
  }

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get estaPublicadoControl(): FormControl {
    return this.group.controls['publicado'] as FormControl;
  }

  get esSubastaControl(): FormControl {
    return this.group.controls['es_subasta'] as FormControl;
  }

  get estaPublicado(): boolean {
    return !!this.estaPublicadoControl.value;
  }

  get esSubasta(): boolean {
    return !!this.esSubastaControl.value;
  }

  ngOnInit(){


    if (this.isEdit || this.isShow) {

      this.form?.get(this.groupName)?.get('remitente_id')?.valueChanges
        .pipe(
          //debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((value) => {

          if (value) {
            // Solo una vez se debe actualizar vista al editar
            setTimeout(() => {
              this.remitenteEventsSubject.next(this.remitente);
            }, 500);

          }

        });

      }

  }

}
