import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { PermisoAccionEnum, PermisoModeloEnum } from 'src/app/enums/permiso-enum';

@Component({
  selector: 'app-page-form',
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss']
})
export class PageFormComponent {

  a = PermisoAccionEnum;

  @Input() formGroup!: FormGroup;
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() hasChange = false;
  @Input() shouldShowActiveButton = false;
  @Input() shouldShowInactiveButton = false;
  @Input() module: string = '';
  @Input() submodule: string = '';
  @Input() viewTitle: string = '';
  @Input() modelo?: PermisoModeloEnum;

  @Output() backClick = new EventEmitter<boolean>();
  @Output() editClick = new EventEmitter();
  @Output() activeClick = new EventEmitter();
  @Output() inactiveClick = new EventEmitter();
  @Output() submitEvent = new EventEmitter();

  constructor(
    private dialog: MatDialog,
  ) { }

  back(): void {
    if (this.isShow || !this.hasChange) {
      this.backClick.emit(false);
    } else {
      this.dialog
        .open(ConfirmationDialogComponent, {
          data: {
            message: '¿Desea guardar los cambios realizados?',
          },
        })
        .afterClosed()
        .pipe(filter((confirmed: boolean) => confirmed !== null))
        .subscribe((confirmed) => {
          this.backClick.emit(confirmed);
        });
    }
  }
}
