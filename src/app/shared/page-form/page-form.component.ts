import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-page-form',
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss']
})
export class PageFormComponent {

  constructor(
    private dialog: MatDialog,
  ) { }

  @Input() formGroup!: FormGroup;
  @Input() isShow = false;
  @Input() hasChange = false;
  @Input() module: string = '';
  @Input() submodule: string = '';
  @Input() viewTitle: string = '';

  @Output() backClick = new EventEmitter<boolean>();
  @Output() submitEvent = new EventEmitter();

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
