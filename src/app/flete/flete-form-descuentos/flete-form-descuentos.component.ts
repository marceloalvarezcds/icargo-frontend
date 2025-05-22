import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DescuentoFormDialogComponent } from 'src/app/dialogs/descuento-form-dialog/descuento-form-dialog.component';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { FleteDescuento } from 'src/app/interfaces/flete-descuento';
import { TableEvent } from 'src/app/interfaces/table';

@Component({
  selector: 'app-flete-form-descuentos',
  templateUrl: './flete-form-descuentos.component.html',
  styleUrls: ['./flete-form-descuentos.component.scss'],
})
export class FleteFormDescuentosComponent {
  columns: Column[] = [
    {
      def: 'concepto_descripcion',
      title: 'Concepto',
      value: (element: FleteDescuento) => element.concepto_descripcion,
      sticky: true,
    },
    {
      def: 'proveedor_monto',
      title: 'A Pagar',
      value: (element: FleteDescuento) => element.proveedor_monto,
      type: 'number',
    },
    {
      def: 'proveedor_monto_ml',
      title: 'A Pagar ML',
      value: (element: FleteDescuento) => element.proveedor_monto_ml,
      type: 'number',
    },
    {
      def: 'proveedor_moneda_nombre',
      title: 'Moneda',
      value: (element: FleteDescuento) => element.proveedor_moneda_nombre,
    },
    {
      def: 'propietario_monto',
      title: 'A Cobrar',
      value: (element: FleteDescuento) => element.propietario_monto,
      type: 'number',
    },
    {
      def: 'propietario_moneda_nombre',
      title: 'Moneda',
      value: (element: FleteDescuento) => element.propietario_moneda_nombre,
    },
    {
      def: 'propietario_monto_ml',
      title: 'A Cobrar ML',
      value: (element: FleteDescuento) => element.propietario_monto_ml,
      type: 'number',
    },
    {
      def: 'anticipado',
      title: 'Anticipado',
      value: (element: FleteDescuento) => (element.anticipado ? 'Si' : 'No'),
    },
    {
      def: 'proveedor_nombre',
      title: 'Proveedor',
      value: (element: FleteDescuento) => element.proveedor_nombre,
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  list: FleteDescuento[] = [];
  modelo = m.FLETE_DESCUENTO;

  @Input() form?: FormGroup;
  @Input() gestorCuentaId?: number;
  @Input() isShow = false;
  @Input() isEdit = false;
  @Input() isEditCopyForm = false;
  @Input() set descuentoList(list: FleteDescuento[]) {
    list.forEach((item) => {
      this.formArray.push(this.createForm(item));
    });
    this.list = list.slice();
  }

  get formArray(): FormArray {
    return this.form!.get('descuentos') as FormArray;
  }

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  create(): void {
    this.dialog
      .open(DescuentoFormDialogComponent, {
        //width: '500px'
        panelClass: 'half-dialog'
      })
      .afterClosed()
      .pipe(filter((descuento) => !!descuento))
      .subscribe((descuento: FleteDescuento) => {
        this.list = this.list.concat([descuento]);
        this.formArray.push(this.createForm(descuento));
      });
  }

  show(event: TableEvent<FleteDescuento>): void {
    const data = event.row;
    this.dialog.open(DescuentoFormDialogComponent, {
      data: { ...data, isShow: true },
      panelClass: 'half-dialog',
    });
  }

  edit(event: TableEvent<FleteDescuento>): void {
    const data = event.row;
    const index = event.index;
    this.dialog
      .open(DescuentoFormDialogComponent, { data,  panelClass: 'half-dialog' })
      .afterClosed()
      .pipe(filter((descuento) => !!descuento))
      .subscribe((descuento: FleteDescuento) => {
        this.list[index] = descuento;
        this.list = this.list.slice();
        this.formArray.setControl(index, this.createForm(descuento));
      });
  }

  remove(event: TableEvent<FleteDescuento>): void {
    const row = event.row;
    const index = event.index;
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          message: `¿Está seguro que desea eliminar al descuento ${row.concepto_descripcion}?`,
        },
      })
      .afterClosed()
      .pipe(filter((confirmed: boolean) => confirmed))
      .subscribe(() => {
        this.list = this.list.filter((_, i) => i !== index);
        this.formArray.removeAt(index);
      });
  }

  private createForm(data: FleteDescuento): FormGroup {
    return this.fb.group({
      id: data.id,
      concepto_id: [data.concepto_id, Validators.required],
      concepto_descripcion: data.concepto.descripcion,
      detalle: data.detalle,
      anticipado: data.anticipado,
      propietario_monto: [data.propietario_monto, Validators.required],
      propietario_monto_ml: data.propietario_monto_ml,
      propietario_moneda_id: [data.propietario_moneda_id, Validators.required],
      propietario_moneda_simbolo: data.propietario_moneda?.simbolo,
      habilitar_pago_proveedor: data.habilitar_pago_proveedor,
      proveedor_monto: data.proveedor_monto,
      proveedor_monto_ml: data.proveedor_monto_ml,
      proveedor_moneda_id: data.proveedor_moneda_id,
      proveedor_moneda_simbolo: data.proveedor_moneda?.simbolo,
      proveedor_id: data.proveedor_id,
    });
  }
}
