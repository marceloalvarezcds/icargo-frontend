import { Component, Input } from '@angular/core';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';

@Component({
  selector: 'app-estado-cuenta-detalle',
  templateUrl: './estado-cuenta-detalle.component.html',
  styleUrls: ['./estado-cuenta-detalle.component.scss'],
})
export class EstadoCuentaDetalleComponent {
  @Input() etapa?: LiquidacionEtapaEnum;
  @Input() estadoCuenta?: EstadoCuenta;
  @Input() showVistaConsolidada = true;
  @Input() showEstado = true;
  @Input() showSaldo = false;
  @Input() showLiquidacion = false;
  @Input() liquidacionId = 0;
  
}

