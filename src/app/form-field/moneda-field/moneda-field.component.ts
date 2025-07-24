import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Moneda } from 'src/app/interfaces/moneda';
import { MonedaService } from 'src/app/services/moneda.service';
import { GenericListFieldComponent } from '../generic-list-field/generic-list-field.component';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-moneda-field',
  templateUrl: './moneda-field.component.html',
  styleUrls: ['./moneda-field.component.scss'],
})
export class MonedaFieldComponent {

  // TODO: corregir este item con la moneda local, no deberia estar en duro
  list$ = this.service.getList()
    .pipe(
      tap((resp) => {
        if (this.auto_select && resp && !this.control.value){
          if (resp){
            resp.forEach((ele:any)=>{
              if (ele[this.auto_select_property] === this.auto_select_filtro){
                const mon = this.value(ele);
                this.control.setValue(mon);
              }
            });
          }
        }
      }),
    );

  @Input() auto_select_filtro="PYG";
  @Input() auto_select_property="simbolo";
  @Input() auto_select=true;
  @Input() controlName = 'moneda_id';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() requerido=false;
  @Input() title = '';
  @Input() readonly=false;
  @Input() value: (v: Moneda) => number | string | Moneda = (v: Moneda) => v.id;
  @Input() selectedMoneda: Moneda | undefined;

  @Output() valueChange = new EventEmitter<Moneda | undefined>();

  @ViewChild('app-generic-list-field')
  genericListFieldComponent?: GenericListFieldComponent<Moneda>;

  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  constructor(private service: MonedaService) {}

  textValueFormat(value: Moneda): string {
    return value.nombre;
  }


}
