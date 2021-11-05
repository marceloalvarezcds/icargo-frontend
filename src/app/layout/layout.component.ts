import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { filter } from 'rxjs/operators';
import { MenuItem } from '../interfaces/menu-item';
import { MenuConfigService } from '../services/menu-config.service';
import { ResponsiveService } from '../services/responsive.service';

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
          path: '/entities/centros-operativos/list',
          active: true,
        },
        {
          name: 'Remitentes',
          iconName: 'open_with',
          path: '/entities/remitente/list',
          active: true,
        },
        {
          name: 'Proveedores',
          iconName: 'event_available',
          path: '/entities/proveedor/list',
          active: true,
        },
        {
          name: 'Gestores de Carga',
          iconName: 'directions_bus',
          path: '/entities/gestor-carga/list',
          active: true,
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
