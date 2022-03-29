import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-liquidacion-comentario',
  templateUrl: './liquidacion-comentario.component.html',
  styleUrls: ['./liquidacion-comentario.component.scss'],
})
export class LiquidacionComentarioComponent {
  @Input() comentario!: string;
}
