import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum,
  PermisoModeloEnum,
} from 'src/app/enums/permiso-enum';
import { Flete } from 'src/app/interfaces/flete';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { PdfPreviewDialogComponent } from 'src/app/orden-carga/pdf-preview-dialog/pdf-preview-dialog.component';
import { DialogService } from 'src/app/services/dialog.service';
import { LoadingService } from 'src/app/services/loading.service';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-page-form',
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss'],
})
export class PageFormComponent implements OnDestroy {
  a = PermisoAccionEnum;
  pdfSrc: string | undefined;
  E = EstadoEnum;
  
  @Input() isAnticiposLiberados = false;
  @Input() puedeConciliar = false;
  @Input() oc?: OrdenCarga;
  @Input() flete?: Flete;
  @Input() isDataLoaded: boolean = false;
  @Input() isFormSaved: boolean | undefined;
  @Input() isAnticipoActive: boolean = false;
  @Input() formGroup!: FormGroup;
  @Input() isNuevo: Boolean = false
  @Input() isAceptado: Boolean = false
  @Input() isCancelado: Boolean = false
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() hasChange = false;
  @Input() hideEditButton = false;
  @Input() cambiarPedido = false;
  @Input() hideSaveButton = false;
  @Input() shouldShowDownloadButton = false;
  @Input() isFormSubmitting: boolean = false;
  @Input() shouldShowActiveButton = false;
  @Input() shouldShowInactiveButton = false;
  @Input() inactiveTooltipText = 'Desactivar';
  @Input() accion = '';
  @Input() module = '';
  @Input() submodule = '';
  @Input() viewTitle = '';
  @Input() modelo?: PermisoModeloEnum;
  @Input() gestorCargaId?: number;
  @Input() groupName?: string;
  @Input() form?: FormGroup;
  @Input() estado: any;
  @Input() controlName = '';
  @Input() isOc: boolean = false;
  @Input() formNuevaOc: boolean = false;
  @Input() nuevoActive: boolean = false;
  @Input() isButtonPressed: boolean = false;
  @Input() isEditPressed: boolean = false;
  @Input() estilosPersonalesModule:any={}
  @Input() estilosPersonalesSubModule:any={}
  @Input() labelBtnGuardar:string="GUARDAR"
  @Input() tooltipBtnGuardar:string="GUARDAR"
  @Input() cantidadOCConAnticiposLiberados = 0;

  @Output() backClick = new EventEmitter<boolean>();
  @Output() downloadClick = new EventEmitter<MouseEvent>();
  @Output() editClick = new EventEmitter();
  @Output() activeClick = new EventEmitter();
  @Output() anticipoClick = new EventEmitter();
  @Output() aceptarClick = new EventEmitter();
  @Output() cancelarClick = new EventEmitter();
  @Output() finalizarClick = new EventEmitter();
  @Output() conciliarClick = new EventEmitter();
  @Output() inactiveClick = new EventEmitter();
  @Output() cancelarFleteClick = new EventEmitter();
  @Output() cambiarFleteClick = new EventEmitter();
  @Output() nuevoClick = new EventEmitter();
  @Output() remitirClick = new EventEmitter();
  @Output() submitEvent = new EventEmitter();
  @Output() formStateChanged = new EventEmitter<FormGroup>();
  @Output() ocChange = new EventEmitter<void>();
  @Output() anticiposBloqueadosChange = new EventEmitter();

  puedeRecibirAnticiposControl: FormControl = new FormControl(false);
  
  constructor(
    private ordenCargaService: OrdenCargaService,
    private reportsService: ReportsService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
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
    if (this.isShow || !this.hasChange || this.submodule === 'ORDEN DE CARGA (directa)') {
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

  backEditOC(): void {
    if (this.isShow || !this.hasChange || this.submodule === 'ORDEN DE CARGA (directa)') {
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

  previewPDF(): void {
    if (!this.oc){
      return
    }
    this.ordenCargaService.pdf(this.oc!.id).subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        const url = URL.createObjectURL(file);
        window.open(url);
        this.pdfSrc = url;
      });
    });
  }

  downloadResumenPDF(): void {
    this.ordenCargaService.resumenPdf(this.oc!.id).subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        const blob = new Blob([file], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        this.dialog.open(PdfPreviewDialogComponent, {
          width: '90%',
          height: '90%',
          data: {
            pdfUrl: url,
            fileBlob: blob,
            filename: filename
          }
        });
      });
    });
  }




  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  get rowValue(): string | number | undefined {
    const obj = this.group.getRawValue();
    return obj[this.controlName];
  }

}
