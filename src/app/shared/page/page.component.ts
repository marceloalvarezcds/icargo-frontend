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
  @Input() module: string = '';
  @Input() submodule: string = '';
  @Input() modelo?: PermisoModeloEnum;

  @Output() applyClick = new EventEmitter<MouseEvent>();
  @Output() backClick = new EventEmitter<boolean>();
  @Output() createClick = new EventEmitter<MouseEvent>();
  @Output() downloadClick = new EventEmitter<MouseEvent>();
  @Output() resetClick = new EventEmitter<MouseEvent>();

  @ViewChild('sidenav') sidenav?: MatSidenav;

  @HostListener('window:resize')
  onResize(): void {
    this.configSidebarMode();
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
}
