import { Component, Input } from '@angular/core';
import { EstadoEnum } from 'src/app/enums/estado-enum';

@Component({
  selector: 'app-estado-field',
  templateUrl: './estado-field.component.html',
  styleUrls: ['./estado-field.component.scss']
})
export class EstadoFieldComponent {

  @Input() estado = EstadoEnum.PENDIENTE;
}
