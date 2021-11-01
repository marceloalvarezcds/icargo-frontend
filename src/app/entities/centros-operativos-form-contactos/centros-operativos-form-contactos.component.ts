import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ContactoFormDialogComponent } from 'src/app/dialogs/contacto-form-dialog/contacto-form-dialog.component';
import { Column } from 'src/app/interfaces/column';
import { TableEvent } from 'src/app/interfaces/table';
import { CentroOperativoContactoGestorCargaList } from 'src/app/interfaces/centro-operativo-contacto-gestor-carga';

@Component({
  selector: 'app-centros-operativos-form-contactos',
  templateUrl: './centros-operativos-form-contactos.component.html',
  styleUrls: ['./centros-operativos-form-contactos.component.scss']
})
export class CentrosOperativosFormContactosComponent {

  columns: Column[] = [
    { def: 'nombre', title: 'Nombre', value: (element: CentroOperativoContactoGestorCargaList) => element.contacto_nombre, sticky: true },
    { def: 'apellido', title: 'Apellido', value: (element: CentroOperativoContactoGestorCargaList) => element.contacto_apellido },
    { def: 'telefono', title: 'Teléfono', value: (element: CentroOperativoContactoGestorCargaList) => element.contacto_telefono },
    { def: 'email', title: 'Correo electrónico', value: (element: CentroOperativoContactoGestorCargaList) => element.contacto_email },
    { def: 'alias', title: 'Alias', value: (element: CentroOperativoContactoGestorCargaList) => element.alias },
    { def: 'cargo', title: 'Cargo', value: (element: CentroOperativoContactoGestorCargaList) => element.cargo_descripcion },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  list: CentroOperativoContactoGestorCargaList[] = [];

  @Input() form!: FormGroup;
  @Input() isShow = false;
  @Input() set contactoList(list: CentroOperativoContactoGestorCargaList[]) {
    list.forEach((contacto) => {
      this.contactoArray.push(this.createConactoForm(contacto));
    });
    this.list = list.slice();
  }

  get contactoArray(): FormArray {
    return this.form.get('contactos') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  addContacto(): void {
    this.dialog
      .open(ContactoFormDialogComponent)
      .afterClosed()
      .pipe(filter((contacto) => !!contacto))
      .subscribe((contacto: CentroOperativoContactoGestorCargaList) => {
        this.list = this.list.concat([contacto]);
        this.contactoArray.push(this.createConactoForm(contacto));
      });
  }

  editContacto(event: TableEvent<CentroOperativoContactoGestorCargaList>): void {
    const data = event.row;
    const index = event.index;
    this.dialog
      .open(ContactoFormDialogComponent, { data })
      .afterClosed()
      .pipe(filter((contacto) => !!contacto))
      .subscribe((contacto: CentroOperativoContactoGestorCargaList) => {
        this.list[index] = contacto;
        this.list = this.list.slice();
        this.contactoArray.setControl(index, this.createConactoForm(contacto));
      });
  }

  removeContacto(event: TableEvent<CentroOperativoContactoGestorCargaList>): void {
    const contacto = event.row;
    const index = event.index;
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          message: `¿Está seguro que desea eliminar al contacto
          ${contacto.contacto_nombre} ${contacto.contacto_apellido}?`,
        },
      })
      .afterClosed()
      .pipe(filter((confirmed: boolean) => confirmed))
      .subscribe(() => {
        this.list = this.list.filter((_, i) => i !== index);
        this.contactoArray.removeAt(index);
      });
  }

  private createConactoForm(contacto: CentroOperativoContactoGestorCargaList): FormGroup {
    return this.fb.group({
      id: contacto.contacto_id,
      nombre: [contacto.contacto_nombre, Validators.required],
      apellido: [contacto.contacto_apellido, Validators.required],
      telefono: [contacto.contacto_telefono, Validators.required],
      email: [contacto.contacto_email, Validators.required],
      alias: [contacto.alias, Validators.required],
      cargo: [contacto.cargo, Validators.required],
    });
  }
}
