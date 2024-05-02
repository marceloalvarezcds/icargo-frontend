import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { Flete } from 'src/app/interfaces/flete';
import { DialogService } from 'src/app/services/dialog.service';
import { FleteService } from 'src/app/services/flete.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-flete-form-acciones',
  templateUrl: './flete-form-acciones.component.html',
  styleUrls: ['./flete-form-acciones.component.scss'],
})
export class FleteFormAccionesComponent {
  E = EstadoEnum;
  @Input() flete?: Flete;
  @Input() isShow = false;

  @Output() fleteChange = new EventEmitter<void>();

  constructor(
    private service: FleteService,
    private snackbar: SnackbarService,
    private dialog: DialogService
  ) {}

  cancelar(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea cancelar el Pedido?',
      this.service.cancel(this.flete!.id),
      () => {
        this.snackbar.open('Estado cambiado satisfactoriamente');
        this.fleteChange.emit();
      }
    );
  }
}
