import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Producto } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-producto-field',
  templateUrl: './producto-field.component.html',
  styleUrls: ['./producto-field.component.scss'],
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
  @Input() readonly = false;
  @Input() title = 'Producto';

  @Output() valueChange = new EventEmitter<Producto | undefined>();

  constructor(private productoService: ProductoService) {}

  textValueFormat(value: Producto): string {
    return value.descripcion;
  }

  value(value: Producto): number {
    return value.id;
  }
}
