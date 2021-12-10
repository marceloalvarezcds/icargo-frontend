import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EstadoEnum } from 'src/app/enums/estado-enum';

@Component({
  selector: 'app-semi-form-info',
  templateUrl: './semi-form-info.component.html',
  styleUrls: ['./semi-form-info.component.scss']
})
export class SemiFormInfoComponent {

  groupName = 'info';
  fotoFile: File | null = null;

  @Input() propietarioId?: number;
  @Input() form?: FormGroup;
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() estado = EstadoEnum.PENDIENTE;
  @Input() foto: string | null = null;

  @Output() fotoChange = new EventEmitter<File | null>();
}
