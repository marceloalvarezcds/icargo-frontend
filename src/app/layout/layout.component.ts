import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { filter } from 'rxjs/operators';
import { PermisoAccionEnum as a, PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { MenuItem } from 'src/app/interfaces/menu-item';
import { MenuConfigService } from 'src/app/services/menu-config.service';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  sidebarMode: MatDrawerMode = 'side';
  menuList: MenuItem[] = [
    {
      name: 'Inicio',
      iconName: 'speed',
      path: '',
      active: true,
      isRouteExact: true,
    },
    {
      name: 'Entidades',
      iconName: 'business',
      active: true,
      children: [
        {
          name: 'Centros Operativos',
          iconName: 'public',
          path: `/entities/${m.CENTRO_OPERATIVO}/${a.LISTAR}`,
          active: this.userService.checkPermiso(a.LISTAR, m.CENTRO_OPERATIVO),
        },
        {
          name: 'Remitentes',
          iconName: 'open_with',
          path: `/entities/${m.REMITENTE}/${a.LISTAR}`,
          active: this.userService.checkPermiso(a.LISTAR, m.REMITENTE),
        },
        {
          name: 'Proveedores',
          iconName: 'event_available',
          path: `/entities/${m.PROVEEDOR}/${a.LISTAR}`,
          active: this.userService.checkPermiso(a.LISTAR, m.PROVEEDOR),
        },
        {
          name: 'Gestores de Carga',
          iconName: 'directions_bus',
          path: `/entities/${m.GESTOR_CARGA}/${a.LISTAR}`,
          active: this.userService.checkPermiso(a.LISTAR, m.GESTOR_CARGA),
        },
      ],
    },
  ];

  toggleSidebarMenuSubscription = this.menuConfigService
    .getToggleSidebarMenuObservable()
    .pipe(filter(() => !!this.sidenav))
    .subscribe((isOpened: boolean) => {
      if (isOpened) {
        this.sidenav!.open();
      } else {
        this.sidenav!.close();
      }
    });

  @ViewChild('sidenav') sidenav?: MatSidenav;

  @HostListener('window:resize')
  onResize(): void {
    this.configSidebarMode();
  }

  constructor(
    public menuConfigService: MenuConfigService,
    private responsiveService: ResponsiveService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.menuConfigService.setMenuItemList(this.menuList);
  }

  ngOnDestroy(): void {
    this.toggleSidebarMenuSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.configSidebarMode();
  }

  closeSidebarMenu(): void {
    if (this.responsiveService.isMobileScreen) {
      this.menuConfigService.setSidebarMenu(false);
    }
  }

  private configSidebarMode(): void {
    setTimeout(() => {
      if (this.responsiveService.isMobileScreen) {
        this.sidebarMode = 'over';
        this.menuConfigService.setSidebarMenu(false);
      } else {
        this.sidebarMode = 'side';
        this.menuConfigService.setSidebarMenu(true);
      }
    });
  }
}
