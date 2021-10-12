import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Contacto } from 'src/app/interfaces/contacto';
import { Column } from 'src/app/interfaces/column';
import { TableEvent } from 'src/app/interfaces/table';
import { ContactoFormDialogComponent } from 'src/app/dialogs/contacto-form-dialog/contacto-form-dialog.component';

@Component({
  selector: 'app-centros-operativos-form-contactos',
  templateUrl: './centros-operativos-form-contactos.component.html',
  styleUrls: ['./centros-operativos-form-contactos.component.scss']
})
export class CentrosOperativosFormContactosComponent {

  columns: Column[] = [
    { def: 'nombre', title: 'Nombre', value: (element: Contacto) => element.nombre, sticky: true },
    { def: 'apellido', title: 'Apellido', value: (element: Contacto) => element.apellido },
    { def: 'telefono', title: 'Teléfono', value: (element: Contacto) => element.telefono },
    { def: 'email', title: 'Correo electrónico', value: (element: Contacto) => element.email },
    { def: 'cargo', title: 'Cargo', value: (element: Contacto) => element.cargo.descripcion },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  list: Contacto[] = [];

  @Input() form!: FormGroup;

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
      .subscribe((contacto: Contacto) => {
        this.contactoArray.push(this.createConactoForm(contacto));
      });
  }

  editContacto(event: TableEvent<Contacto>): void {
    const data = event.row;
    const index = event.index;
    this.dialog
      .open(ContactoFormDialogComponent, { data })
      .afterClosed()
      .pipe(filter((contacto) => !!contacto))
      .subscribe((contacto: Contacto) => {
        this.list[index] = contacto;
        this.list = this.list.slice();
        this.contactoArray.at(index).setValue(contacto);
      });
  }

  removeContacto(event: TableEvent<Contacto>): void {
    const contacto = event.row;
    const index = event.index;
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          message: `¿Está seguro que desea eliminar al contacto
          ${contacto.nombre} ${contacto.apellido}?`,
        },
      })
      .afterClosed()
      .pipe(filter((confirmed: boolean) => confirmed))
      .subscribe(() => {
        this.list = this.list.filter((_, i) => i !== index);
        this.contactoArray.removeAt(index);
      });
  }

  private createConactoForm(contacto: Contacto): FormGroup {
    this.list = this.list.concat([contacto]);
    return this.fb.group({
      nombre: [contacto.nombre, Validators.required],
      apellido: [contacto.apellido, Validators.required],
      telefono: [contacto.telefono, Validators.required],
      email: [contacto.email, Validators.required],
      cargo: [contacto.cargo, Validators.required],
    });
  }
}
