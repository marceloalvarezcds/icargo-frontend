import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TipoCargaService } from 'src/app/services/tipo-carga.service';

@Component({
  selector: 'app-tipo-carga-field',
  templateUrl: './tipo-carga-field.component.html',
  styleUrls: ['./tipo-carga-field.component.scss']
})
export class TipoCargaFieldComponent {

  list$ = this.tipoCargaService.getList();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'tipo_carga_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Tipo de Carga';
  @Input() readonly = false;

  constructor(private tipoCargaService: TipoCargaService) { }
}
