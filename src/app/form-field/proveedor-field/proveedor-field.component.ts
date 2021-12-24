import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { ProveedorService } from 'src/app/services/proveedor.service';

@Component({
  selector: 'app-proveedor-field',
  templateUrl: './proveedor-field.component.html',
  styleUrls: ['./proveedor-field.component.scss']
})
export class ProveedorFieldComponent {

  list$ = this.proveedorService.getListByGestorCuentaId();

  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'proveedor_id';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() title = 'Proveedor';

  constructor(private proveedorService: ProveedorService) { }

  compareWith(o1?: Proveedor, o2?: Proveedor): boolean {
    return o1?.id === o2?.id;
  }
}
