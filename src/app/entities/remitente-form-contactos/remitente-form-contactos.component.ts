import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ContactoFormDialogComponent } from 'src/app/dialogs/contacto-form-dialog/contacto-form-dialog.component';
import { Column } from 'src/app/interfaces/column';
import { RemitenteContactoGestorCargaList } from 'src/app/interfaces/remitente-contacto-gestor-carga';
import { TableEvent } from 'src/app/interfaces/table';

@Component({
  selector: 'app-remitente-form-contactos',
  templateUrl: './remitente-form-contactos.component.html',
  styleUrls: ['./remitente-form-contactos.component.scss']
})
export class RemitenteFormContactosComponent {

  columns: Column[] = [
    { def: 'nombre', title: 'Nombre', value: (element: RemitenteContactoGestorCargaList) => element.contacto_nombre, sticky: true },
    { def: 'apellido', title: 'Apellido', value: (element: RemitenteContactoGestorCargaList) => element.contacto_apellido },
    { def: 'telefono', title: 'Teléfono', value: (element: RemitenteContactoGestorCargaList) => element.contacto_telefono },
    { def: 'email', title: 'Correo electrónico', value: (element: RemitenteContactoGestorCargaList) => element.contacto_email },
    { def: 'alias', title: 'Alias', value: (element: RemitenteContactoGestorCargaList) => element.alias },
    { def: 'cargo', title: 'Cargo', value: (element: RemitenteContactoGestorCargaList) => element.cargo_descripcion },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  list: RemitenteContactoGestorCargaList[] = [];

  @Input() form!: FormGroup;
  @Input() isShow = false;
  @Input() set contactoList(list: RemitenteContactoGestorCargaList[]) {
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
      .subscribe((contacto: RemitenteContactoGestorCargaList) => {
        this.list = this.list.concat([contacto]);
        this.contactoArray.push(this.createConactoForm(contacto));
      });
  }

  editContacto(event: TableEvent<RemitenteContactoGestorCargaList>): void {
    const data = event.row;
    const index = event.index;
    this.dialog
      .open(ContactoFormDialogComponent, { data })
      .afterClosed()
      .pipe(filter((contacto) => !!contacto))
      .subscribe((contacto: RemitenteContactoGestorCargaList) => {
        this.list[index] = contacto;
        this.list = this.list.slice();
        this.contactoArray.setControl(index, this.createConactoForm(contacto));
      });
  }

  removeContacto(event: TableEvent<RemitenteContactoGestorCargaList>): void {
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

  private createConactoForm(contacto: RemitenteContactoGestorCargaList): FormGroup {
    return this.fb.group({
      id: contacto.contacto_id,
      nombre: [contacto.contacto_nombre, Validators.required],
      apellido: [contacto.contacto_apellido, Validators.required],
      telefono: [contacto.contacto_telefono, Validators.required],
      email: [contacto.contacto_email, Validators.required],
      alias: contacto.alias,
      cargo: [contacto.cargo, Validators.required],
    });
  }
}
