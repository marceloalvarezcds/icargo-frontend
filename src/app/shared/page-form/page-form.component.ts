import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import {
  PermisoAccionEnum,
  PermisoModeloEnum,
} from 'src/app/enums/permiso-enum';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-page-form',
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss'],
})
export class PageFormComponent implements OnDestroy {
  a = PermisoAccionEnum;

  @Input() formGroup!: FormGroup;
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() hasChange = false;
  @Input() hideEditButton = false;
  @Input() hideSaveButton = false;
  @Input() shouldShowDownloadButton = false;
  @Input() shouldShowActiveButton = false;
  @Input() shouldShowInactiveButton = false;
  @Input() inactiveTooltipText = 'Desactivar';
  @Input() module = '';
  @Input() submodule = '';
  @Input() viewTitle = '';
  @Input() modelo?: PermisoModeloEnum;
  @Input() gestorCargaId?: number;

  @Output() backClick = new EventEmitter<boolean>();
  @Output() downloadClick = new EventEmitter<MouseEvent>();
  @Output() editClick = new EventEmitter();
  @Output() activeClick = new EventEmitter();
  @Output() inactiveClick = new EventEmitter();
  @Output() submitEvent = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private loadingService: LoadingService
  ) {}

  loading = false;
  loadingSubscription = this.loadingService
    .getLoadingObservable()
    .subscribe((loading) => {
      this.loading = loading;
    });

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

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
