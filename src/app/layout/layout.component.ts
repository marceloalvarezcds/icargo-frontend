import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { filter } from 'rxjs/operators';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { MenuItem } from 'src/app/interfaces/menu-item';
import { MenuConfigService } from 'src/app/services/menu-config.service';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnDestroy, AfterViewInit {
  sidebarMode: MatDrawerMode = 'side';
  menuList: MenuItem[] = [];
  userSubscription = this.userService.getLoggedUser().subscribe(() => {
    this.loadMenus();
  });

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
    private userService: UserService
  ) {}

  ngOnDestroy(): void {
    this.toggleSidebarMenuSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
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

  private loadMenus(): void {
    this.menuList = [
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
            iconOutline: true,
            path: `/entities/${m.GESTOR_CARGA}/${a.LISTAR}`,
            active: this.userService.checkPermiso(a.LISTAR, m.GESTOR_CARGA),
          },
        ],
      },
      {
        name: 'Flota',
        iconName: 'local_shipping',
        iconOutline: true,
        active: true,
        children: [
          {
            name: 'Propietarios',
            iconName: 'key',
            path: `/flota/${m.PROPIETARIO}/${a.LISTAR}`,
            active: this.userService.checkPermiso(a.LISTAR, m.PROPIETARIO),
          },
          {
            name: 'Choferes',
            iconName: 'badge',
            iconOutline: true,
            path: `/flota/${m.CHOFER}/${a.LISTAR}`,
            active: this.userService.checkPermiso(a.LISTAR, m.CHOFER),
          },
          {
            name: 'Camiones',
            iconName: 'local_shipping',
            iconOutline: true,
            path: `/flota/${m.CAMION}/${a.LISTAR}`,
            active: this.userService.checkPermiso(a.LISTAR, m.CAMION),
          },
          {
            name: 'Semi-remolques',
            iconName: 'local_shipping',
            path: `/flota/${m.SEMIRREMOLQUE}/${a.LISTAR}`,
            active: this.userService.checkPermiso(a.LISTAR, m.SEMIRREMOLQUE),
          },
        ],
      },
      {
        name: 'Flete',
        iconName: 'timeline',
        iconOutline: true,
        path: `/flete/${m.FLETE}/${a.LISTAR}`,
        active: this.userService.checkPermiso(a.LISTAR, m.FLETE),
      },
      {
        name: 'Orden de Carga',
        iconName: 'description',
        iconOutline: true,
        path: `/orden-carga/${m.ORDEN_CARGA}/${a.LISTAR}`,
        active: this.userService.checkPermiso(a.LISTAR, m.ORDEN_CARGA),
      },
      {
        name: 'Caja & Banco',
        iconName: 'account_balance_wallet',
        // iconName: 'local_atm',
        iconOutline: true,
        active: true,
        children: [
          {
            name: 'Caja',
            iconName: 'inventory_2',
            iconOutline: true,
            path: `/caja/${m.CAJA}/${a.LISTAR}`,
            active: this.userService.checkPermiso(a.LISTAR, m.CAJA),
          },
          {
            name: 'Banco',
            iconName: 'account_balance',
            iconOutline: true,
            path: `/banco/${m.BANCO}/${a.LISTAR}`,
            active: this.userService.checkPermiso(a.LISTAR, m.BANCO),
          },
        ],
      },
      {
        name: 'Estado de Cuenta',
        iconName: 'summarize',
        iconOutline: true,
        path: `/estado-cuenta/${m.ESTADO_CUENTA}/${a.LISTAR}`,
        active: this.userService.checkPermiso(a.LISTAR, m.MOVIMIENTO),
      },
      {
        name: 'Listados',
        iconName: 'format_list_numbered',
        // iconName: 'local_atm',
        iconOutline: true,
        active: true,
        children: [
          {
            name: 'Rentabilidad',
            iconName: 'request_quote',
            iconOutline: true,
            path: `/listado/${m.RENTABILIDAD}/${a.LISTAR}`,
            active: this.userService.checkPermiso(a.LISTAR, m.RENTABILIDAD),
          },
        ],
      },
    ];
    this.menuConfigService.setMenuItemList(this.menuList);
  }
}
