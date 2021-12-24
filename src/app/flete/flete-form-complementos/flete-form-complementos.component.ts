import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ComplementoFormDialogComponent } from 'src/app/dialogs/complemento-form-dialog/complemento-form-dialog.component';
import { Column } from 'src/app/interfaces/column';
import { TableEvent } from 'src/app/interfaces/table';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { FleteComplemento } from 'src/app/interfaces/flete-complemento';

@Component({
  selector: 'app-flete-form-complementos',
  templateUrl: './flete-form-complementos.component.html',
  styleUrls: ['./flete-form-complementos.component.scss']
})
export class FleteFormComplementosComponent {

  columns: Column[] = [
    { def: 'concepto_descripcion', title: 'Concepto', value: (element: FleteComplemento) => element.concepto_descripcion, sticky: true },
    { def: 'remitente_monto', title: 'A Cobrar', value: (element: FleteComplemento) => element.remitente_monto },
    { def: 'remitente_moneda_nombre', title: 'Moneda', value: (element: FleteComplemento) => element.remitente_moneda_nombre },
    { def: 'propietario_monto', title: 'A Pagar', value: (element: FleteComplemento) => element.propietario_monto },
    { def: 'propietario_moneda_nombre', title: 'Moneda', value: (element: FleteComplemento) => element.propietario_moneda_nombre },
    { def: 'anticipado', title: 'Anticipado', value: (element: FleteComplemento) => element.anticipado ? 'Si' : 'No' },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  list: FleteComplemento[] = [];
  modelo = m.FLETE_COMPLEMENTO;

  @Input() form?: FormGroup;
  @Input() gestorCuentaId?: number;
  @Input() isShow = false;
  @Input() set complementoList(list: FleteComplemento[]) {
    list.forEach((item) => {
      this.formArray.push(this.createForm(item));
    });
    this.list = list.slice();
  }

  get formArray(): FormArray {
    return this.form!.get('complementos') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  create(): void {
    this.dialog
      .open(ComplementoFormDialogComponent)
      .afterClosed()
      .pipe(filter((complemento) => !!complemento))
      .subscribe((complemento: FleteComplemento) => {
        this.list = this.list.concat([complemento]);
        this.formArray.push(this.createForm(complemento));
      });
  }

  edit(event: TableEvent<FleteComplemento>): void {
    const data = event.row;
    const index = event.index;
    this.dialog
      .open(ComplementoFormDialogComponent, { data })
      .afterClosed()
      .pipe(filter((complemento) => !!complemento))
      .subscribe((complemento: FleteComplemento) => {
        this.list[index] = complemento;
        this.list = this.list.slice();
        this.formArray.setControl(index, this.createForm(complemento));
      });
  }

  remove(event: TableEvent<FleteComplemento>): void {
    const row = event.row;
    const index = event.index;
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          message: `¿Está seguro que desea eliminar al complemento ${row.concepto_descripcion}?`,
        },
      })
      .afterClosed()
      .pipe(filter((confirmed: boolean) => confirmed))
      .subscribe(() => {
        this.list = this.list.filter((_, i) => i !== index);
        this.formArray.removeAt(index);
      });
  }

  private createForm(data: FleteComplemento): FormGroup {
    return this.fb.group({
      id: data.id,
      concepto_id: [data.concepto_id, Validators.required],
      detalle: data.detalle,
      anticipado: data.anticipado,
      propietario_monto: [data.propietario_monto, Validators.required],
      propietario_moneda_id: [data.propietario_moneda_id, Validators.required],
      habilitar_cobro_remitente: data.habilitar_cobro_remitente,
      remitente_monto: data.remitente_monto,
      remitente_moneda_id: data.remitente_moneda_id,
    });
  }
}
