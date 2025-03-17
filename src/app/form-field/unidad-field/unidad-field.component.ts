import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { GenericListFieldComponent } from 'src/app/form-field/generic-list-field/generic-list-field.component';
import { Unidad } from 'src/app/interfaces/unidad';
import { UnidadService } from 'src/app/services/unidad.service';

@Component({
  selector: 'app-unidad-field',
  templateUrl: './unidad-field.component.html',
  styleUrls: ['./unidad-field.component.scss'],
})
export class UnidadFieldComponent {

  //list: Unidad[] = [];
  list$ = this.unidadService.getList()
    .pipe(
        tap((resp) => {
          if (this.auto_select && resp && !this.control.value){
            resp.forEach((ele:any)=>{
              if (ele[this.auto_select_property] === this.auto_select_filtro){
                this.control.setValue(ele.id)
              }
            });
          }
        }),
    );


  @Input() set optionsList(l: Unidad[]) {
    //this.list = l;
    // auto-carga hacer en este apartado
  }
  @Input() auto_select_filtro= "kg";
  @Input() auto_select_property= "abreviatura";
  @Input() auto_select=true;
  @Input() form?: FormGroup;
  @Input() controlName = 'unidad_id';
  @Input() groupName?: string;
  @Input() title = '';
  @Input() readonly: boolean = false;

  @Output() valueChange = new EventEmitter<Unidad | undefined>();

  @ViewChild('app-generic-list-field')
  GenericListFieldComponent?: GenericListFieldComponent<Unidad>;

  constructor(private unidadService: UnidadService) { }

  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  textValueFormat(value: Unidad): string {
    return value.descripcion;
  }

  value(value: Unidad): number {
    return value.id;
  }

}
