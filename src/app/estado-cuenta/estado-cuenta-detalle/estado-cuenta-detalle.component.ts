import { Component, Input, OnInit } from '@angular/core';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';

@Component({
  selector: 'app-estado-cuenta-detalle',
  templateUrl: './estado-cuenta-detalle.component.html',
  styleUrls: ['./estado-cuenta-detalle.component.scss'],
})
export class EstadoCuentaDetalleComponent {
  @Input() estado?: EstadoEnum;
  @Input() estadoCuenta?: EstadoCuenta;
}
