import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  permisoModeloTitulo as t,
} from 'src/app/enums/permiso-enum';
import { MenuItem } from 'src/app/interfaces/menu-item';
import { Tab } from 'src/app/interfaces/tab';
import { MenuService } from './menu.service';

@Injectable({
  providedIn: 'root',
})
export class TabService {
  private tabs: Tab[] = [];

  private routerSubscription = combineLatest([
    this.menuList$,
    this.routerEvents$,
  ]).subscribe(([menuList, routerEvent]) => {
    const routerUrl = routerEvent.url.split('?')[0];
    const dArray = routerEvent.url.match(/\d+/);
    const id = dArray && dArray.length ? parseInt(dArray[0], 10) : undefined;
    const menu = menuList.find((m) => {
      return this.comparePathWithRouterUrl(this.getPathStr(m.path), routerUrl);
    });
    if (menu) {
      const path = this.getPathStr(menu.path);
      const url = path === routerUrl ? `${routerUrl}/${a.LISTAR}` : routerUrl;
      const queryParams = this.activatedRoute.snapshot.queryParams;
      const extras = Object.keys(queryParams).length ? { queryParams } : {};
      const str = JSON.stringify;
      const find = this.tabs.some(
        (tab) => tab.url === url && str(tab.extras) === str(extras)
      );
      if (!find) {
        const name = this.getTabNameByMenuAndUrl(menu, url, queryParams, id);
        this.addTab({ name, path, url, extras });
      }
    }
  });

  get list(): Tab[] {
    return this.tabs;
  }

  get menuList$(): Observable<MenuItem[]> {
    return this.menuService.list$.pipe(
      map((menuList) => {
        const menuChildren = menuList
          .filter((m) => m.children && m.children.length > 0)
          .reduce((list: MenuItem[], menu) => list.concat(menu.children!), []);
        const menuPaths = menuList.filter((m) => !!m.path && !m.children);
        return menuChildren.filter((m) => !!m.path).concat(menuPaths);
      })
    );
  }

  get routerEvents$(): Observable<NavigationEnd> {
    return this.router.events.pipe(
      // e: ActivationEnd | ChildActivationEnd | Scroll | NavigationEnd
      filter((e: any) => e instanceof NavigationEnd)
    );
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private menuService: MenuService
  ) {}

  unsubscribe(): void {
    this.routerSubscription.unsubscribe();
  }

  addTab(tab: Tab) {
    this.tabs.push(tab);
  }

  removeTab(index: number) {
    const currentTab = this.tabs[index];
    const routerUrl = this.router.url.split('?')[0];
    const url = currentTab.url;
    if (url === routerUrl) {
      const path = currentTab.path;
      const listarUrl = `${path}/${a.LISTAR}`;
      const existUrlInTabs = this.tabs.some(
        (t, idx) => t.url === listarUrl && idx !== index
      );
      const previousTab = index > 0 ? this.tabs[index - 1] : this.tabs[0];
      let pathToRedirect, extras;
      if (!existUrlInTabs || listarUrl === url) {
        extras = previousTab.extras;
        pathToRedirect = previousTab.url;
      } else {
        extras = currentTab.extras;
        pathToRedirect = path;
      }
      this.router.navigateByUrl(pathToRedirect, extras);
    }
    this.tabs.splice(index, 1);
  }

  private comparePathWithRouterUrl(path: string, url: string): boolean {
    const pathStr = Array.isArray(path) ? path.join('/') : path!;
    const pathRegex = new RegExp(pathStr);
    const urlRegex = new RegExp(url);
    return url !== '/' && (pathRegex.test(url) || urlRegex.test(pathStr));
  }

  private getPathStr(path: any[] | string | undefined): string {
    return path ? (Array.isArray(path) ? path.join('/') : path) : '/';
  }

  private getTabNameByMenuAndUrl(
    menu: MenuItem,
    url: string,
    queryParams: Params,
    id: number | undefined
  ): string {
    const isLiquidacion = this.router.url.includes(m.LIQUIDACION);
    const isMovimiento = this.router.url.includes(m.MOVIMIENTO);
    const name = isLiquidacion
      ? t[m.LIQUIDACION]
      : isMovimiento
      ? t[m.MOVIMIENTO]
      : menu.name;
    const etapa = queryParams.etapa;
    const etapaInfo = etapa ? ` ${etapa}` : '';
    const createRegex = new RegExp(a.CREAR);
    const editRegex = new RegExp(a.EDITAR);
    const showRegex = new RegExp(a.VER);
    const idInfo = id ? ` Nº ${id}` : '';
    if (createRegex.test(url)) {
      return `Crear ${name}`;
    } else if (editRegex.test(url)) {
      return `Editar ${name}${etapaInfo}${idInfo}`;
    } else if (showRegex.test(url)) {
      return `Ver ${name}${etapaInfo}${idInfo}`;
    }
    return `Listar ${name}${etapaInfo}`;
  }
}
