import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-producto-field',
  templateUrl: './producto-field.component.html',
  styleUrls: ['./producto-field.component.scss']
})
export class ProductoFieldComponent {

  list$ = this.productoService.getList();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'producto_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Producto';

  constructor(private productoService: ProductoService) { }
}
