import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { Camion } from 'src/app/interfaces/camion';

@Component({
  selector: 'app-camion-form-info',
  templateUrl: './camion-form-info.component.html',
  styleUrls: ['./camion-form-info.component.scss'],
})
export class CamionFormInfoComponent {
  ACTIVO = EstadoEnum.ACTIVO;
  groupName = 'info';
  fotoFile: File | null = null;

  @Input() propietarioId?: number;
  @Input() tractoId?: number;
  @Input() form?: FormGroup;
  @Input() camion?: Camion;
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() estado = EstadoEnum.PENDIENTE;
  @Input() foto: string | null = null;

  @Output() fotoChange = new EventEmitter<File | null>();
}
