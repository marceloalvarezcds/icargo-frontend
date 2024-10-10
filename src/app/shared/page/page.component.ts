import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import {
  PermisoAccionEnum,
  PermisoModeloEnum,
} from 'src/app/enums/permiso-enum';
import { ButtonList } from 'src/app/interfaces/buttonList';
import { ResponsiveService } from 'src/app/services/responsive.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent {
  a = PermisoAccionEnum;
  sidebarMode: MatDrawerMode = 'side';

  @Input() hideBack = true;
  @Input() hideCreate = false;
  @Input() hideFilter = false;
  @Input() module = '';
  @Input() submodule = '';
  @Input() viewTitle = '';
  @Input() modelo?: PermisoModeloEnum;
  @Input() dbuttons?: ButtonList[] = []

  @Output() applyClick = new EventEmitter<MouseEvent>();
  @Output() backClick = new EventEmitter<boolean>();
  @Output() createClick = new EventEmitter<MouseEvent>();
  @Output() createAnticipoClick = new EventEmitter<MouseEvent>();
  @Output() createRecepcionClick = new EventEmitter<MouseEvent>();
  @Output() aceptarClick = new EventEmitter<MouseEvent>();
  @Output() finalizarClick = new EventEmitter<MouseEvent>();
  @Output() conciliarClick = new EventEmitter<MouseEvent>();
  @Output() downloadClick = new EventEmitter<MouseEvent>();
  @Output() resetClick = new EventEmitter<MouseEvent>();


  @ViewChild('sidenav') sidenav?: MatSidenav;

  @HostListener('window:resize')
  onResize(): void {
    this.configSidebarMode();
  }
  activeSection: boolean = false;
  onRecepcionClick(event: MouseEvent): void {
    this.activeSection;
    this.createAnticipoClick.emit(event); // Emitir evento para "Recepcion"
  }

  constructor(private responsiveService: ResponsiveService) {}

  private configSidebarMode(): void {
    setTimeout(() => {
      if (this.responsiveService.isMobileScreen) {
        this.sidebarMode = 'over';
        this.sidenav!.close();
      } else {
        this.sidebarMode = 'side';
      }
    });
  }

  getButtonStyles(submodule: string): { [key: string]: string } {
    const baseStyles = {
      'padding': '15px',
      'font-family': "'Roboto', sans-serif",
      'font-size': '12px',
      'font-weight': '580',
      'line-height': '18.75px',
      'letter-spacing': '0.06em',
    };

    switch (submodule) {
      case 'CLIENTES':
      case 'CENTROS OPERATIVOS':
      case 'PROVEEDORES':
      case 'CHOFERES':
      case 'TRACTOS':
      case 'SEMIS':
      case 'COMBINACION DE FLOTA':
      case 'PROPIETARIOS':
      case 'GESTORES DE CARGA':
      case 'PEDIDOS':
      case 'Orden de Carga':
      case 'CAJAS':
      case 'USUARIOS':
        return baseStyles;
      case 'Todas las CUENTAS CORRIENTES':
        return {...baseStyles, border:'1px solid #1C1C1C29'};
      default:
        return { 'padding': '6px', 'min-width': '80px' };
    }
  }

  back(): void {
    this.backClick.emit(false);
  }

}
