import { Injectable } from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  permisoModeloTitulo as t,
  PermisoModuloEnum as u,
} from 'src/app/enums/permiso-enum';
import { MenuItem } from 'src/app/interfaces/menu-item';
import { MenuConfigService } from 'src/app/services/menu-config.service';
import { UserService } from 'src/app/services/user.service';
import { ResponsiveService } from '../services/responsive.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  isExpanded = false;
  private userSubscription = this.userService.getLoggedUser().subscribe(() => {
    this.loadMenus();
  });

  private toggleSidebarMenuSubscription = this.menuConfigService
    .getToggleSidebarMenuObservable()
    .pipe(filter(() => !!this.sidenav))
    .subscribe((isOpened: boolean) => {
      if (this.responsiveService.isMobileScreen) {
        isOpened ? this.sidenav!.open() : this.sidenav!.close();
      } else {
        isOpened ? (this.isExpanded = true) : (this.isExpanded = false);
      }
    });

  private sidenav?: MatSidenav;
  private matDrawerMode: MatDrawerMode = 'side';
  private menuList: MenuItem[] = [];

  constructor(
    private menuConfigService: MenuConfigService,
    private responsiveService: ResponsiveService,
    private userService: UserService
  ) {}

  get list$(): Observable<MenuItem[]> {
    return this.menuConfigService.getMenuItemListObservable();
  }

  get sidebarMode(): MatDrawerMode {
    return this.matDrawerMode;
  }

  closeSidebarMenu(): void {
    this.menuConfigService.setSidebarMenu(false);
  }

  expandSidebar(): void {
    this.isExpanded = true;
  }

  // Colapsa el menú
  collapseSidebar(): void {
    this.isExpanded = false;
  }

  configSidebarModeByScreen(): void {
    setTimeout(() => {
      if (this.responsiveService.isMobileScreen) {
        this.isExpanded = true;
        this.matDrawerMode = 'over';
      } else {
        this.sidenav!.open();
        this.matDrawerMode = 'side';
      }
      this.menuConfigService.setSidebarMenu(false);
    });
  }

  unsubscribe(): void {
    this.toggleSidebarMenuSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  setSidenav(val: MatSidenav): void {
    this.sidenav = val;
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
        name: u.ENTIDADES,
        iconName: 'business',
        active: true,
        children: [
          {
            name: 'Clientes',
            iconName: 'open_with',
            path: `/entities/${m.REMITENTE}`,
            active: this.userService.checkPermiso(a.LISTAR, m.REMITENTE),
          },
          {
            name: t[m.CENTRO_OPERATIVO],
            iconName: 'public',
            path: `/entities/${m.CENTRO_OPERATIVO}`,
            active: this.userService.checkPermiso(a.LISTAR, m.CENTRO_OPERATIVO),
          },

          {
            name: t[m.PROVEEDOR],
            iconName: 'event_available',
            path: `/entities/${m.PROVEEDOR}`,
            active: this.userService.checkPermiso(a.LISTAR, m.PROVEEDOR),
          },
          {
            name: t[m.GESTOR_CARGA],
            iconName: 'directions_bus',
            iconOutline: true,
            path: `/entities/${m.GESTOR_CARGA}`,
            active: this.userService.checkPermiso(a.LISTAR, m.GESTOR_CARGA),
          },
        ],
      },

      {
        name: u.FLOTA,
        iconName: 'local_shipping',
        iconOutline: true,
        active: true,
        children: [
          {
            name: 'Combinación',
            iconName: 'airport_shuttle',
            path: `/flota/${m.COMBINACION}`,
            active: this.userService.checkPermiso(a.LISTAR, m.COMBINACION),
          },
          {
            name: 'Titulares',
            iconName: 'key',
            path: `/flota/${m.PROPIETARIO}`,
            active: this.userService.checkPermiso(a.LISTAR, m.PROPIETARIO),
          },

          {
            name: 'Choferes',
            iconName: 'badge',
            iconOutline: true,
            path: `/flota/${m.CHOFER}`,
            active: this.userService.checkPermiso(a.LISTAR, m.CHOFER),
          },
          {
            name: 'Tractos',
            iconName: 'local_shipping',
            iconOutline: true,
            path: `/flota/${m.CAMION}`,
            active: this.userService.checkPermiso(a.LISTAR, m.CAMION),
          },
          {
            name: 'Semis',
            iconName: 'local_shipping',
            path: `/flota/${m.SEMIRREMOLQUE}`,
            active: this.userService.checkPermiso(a.LISTAR, m.SEMIRREMOLQUE),
          },
        ],
      },
      {
        name: 'Mercaderias',
        iconName: 'inventory_2',
        iconOutline: true,
        path: `/insumo_punto_venta_precio/${m.INSUMO_PUNTO_VENTA_PRECIO}`,
        active: this.userService.checkPermiso(a.LISTAR, m.INSUMO_PUNTO_VENTA_PRECIO),
      },
      {
        name: 'Pedido',
        iconName: 'timeline',
        iconOutline: true,
        path: `/flete/${m.FLETE}`,
        active: this.userService.checkPermiso(a.LISTAR, m.FLETE),
      },
      {
        name: u.OC,
        iconName: 'description',
        iconOutline: true,
        path: `/orden-carga/${m.ORDEN_CARGA}`,
        active: this.userService.checkPermiso(a.LISTAR, m.ORDEN_CARGA),
      },
      {
        name: u.CAJA_BANCO,
        iconName: 'account_balance_wallet',
        // iconName: 'local_atm',
        iconOutline: true,
        active: true,
        children: [
          {
            name: t[m.CAJA],
            iconName: 'inventory_2',
            iconOutline: true,
            path: `/caja/${m.CAJA}`,
            active: this.userService.checkPermiso(a.LISTAR, m.CAJA),
          },
          {
            name: t[m.BANCO],
            iconName: 'account_balance',
            iconOutline: true,
            path: `/banco/${m.BANCO}`,
            active: this.userService.checkPermiso(a.LISTAR, m.BANCO),
          },
        ],
      },
      {
        name: u.CUENTA_CORRIENTE,
        iconName: 'summarize',
        // iconName: 'local_atm',
        iconOutline: true,
        active: true,
        children: [
          {
            name: t[m.ESTADO_CUENTA],
            iconName: 'summarize',
            iconOutline: true,
            path: `/estado-cuenta/${m.ESTADO_CUENTA}`,
            active: this.userService.checkPermiso(a.LISTAR, m.ESTADO_CUENTA),
          },
          {
            name: t[m.PUNTO_VENTA],
            iconName: 'summarize',
            iconOutline: true,
            path: `/estado-cuenta/${m.PUNTO_VENTA}`,
            active: this.userService.checkPermiso(a.LISTAR, m.ESTADO_CUENTA),
          },
        ],
      },
      {
        name: u.LIQUIDACION,
        iconName: 'attach_money',
        iconOutline: true,
        path: `/estado-cuenta/${m.LIQUIDACION}`,
        active: this.userService.checkPermiso(a.LISTAR, m.LIQUIDACION),
      },
      {
        name: u.LISTADOS,
        iconName: 'format_list_numbered',
        // iconName: 'local_atm',
        iconOutline: true,
        active: true,
        children: [
          {
            name: t[m.RENTABILIDAD],
            iconName: 'request_quote',
            iconOutline: true,
            path: `/listado/${m.RENTABILIDAD}`,
            active: this.userService.checkPermiso(a.LISTAR, m.RENTABILIDAD),
          },
          {
            name: t[m.MOVIMIENTO],
            iconName: 'list_alt',
            iconOutline: true,
            path: `/listado/${m.MOVIMIENTO}`,
            active: this.userService.checkPermiso(a.LISTAR, m.MOVIMIENTO),
          },
        ],
      },
      {
        name: u.BIBLIOTECA,
        iconName: 'settings',
        iconOutline: true,
        active: true,
        children: [
          {
            name: t[m.CARGO],
            iconName: 'badge',
            iconOutline: true,
            path: `/biblioteca/${m.CARGO}`,
            active: this.userService.checkPermiso(a.LISTAR, m.CARGO),
          },
        ],
      },
      {
        name: u.PARAMETROS,
        iconName: 'build_circle',
        iconOutline: true,
        active: this.userService.checkIfIsAdminIcargo(),
        children: [
          {
            name: t[m.TIPO_CUENTA],
            iconName: 'wallet',
            iconOutline: true,
            path: `/parametros/${m.TIPO_CUENTA}`,
            active: this.userService.checkPermiso(a.LISTAR, m.TIPO_CUENTA),
          },
          {
            name: t[m.TIPO_MOVIMIENTO],
            iconName: 'wysiwyg',
            iconOutline: true,
            path: `/parametros/${m.TIPO_MOVIMIENTO}`,
            active: this.userService.checkPermiso(a.LISTAR, m.TIPO_MOVIMIENTO),
          },
        ],
      },
      {
        name: u.USUARIOS,
        iconName: 'supervisor_account',
        iconOutline: true,
        active: true,
        children: [
          {
            name: t[m.USER],
            iconName: 'person',
            iconOutline: true,
            path: `/users/${m.USER}`,
            active: this.userService.checkPermiso(a.LISTAR, m.USER),
          },
          {
            name: t[m.ROL],
            iconName: 'admin_panel_settings',
            iconOutline: true,
            path: `/users/${m.ROL}`,
            active: this.userService.checkPermiso(a.LISTAR, m.ROL),
          },
        ],
      },
    ];
    this.menuConfigService.setMenuItemList(this.menuList);
  }
}
