import { Location } from '@angular/common';
import {
  ComponentFactoryResolver,
  Injectable,
  QueryList,
  ViewContainerRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  NavigationEnd,
  NavigationExtras,
  Params,
  Router,
} from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  permisoModeloTitulo as t,
} from 'src/app/enums/permiso-enum';
import { MenuItem } from 'src/app/interfaces/menu-item';
import { Tab } from 'src/app/interfaces/tab';
import { ActivatedRouteService } from 'src/app/services/activated-route.service';
import { MenuService } from './menu.service';

@Injectable({
  providedIn: 'root',
})
export class TabService {
  currentUrl = this.route.url;
  selected = new FormControl(0);
  private componentList: any[] = [];
  private tabs: Tab[] = [];
  private frameList?: QueryList<ViewContainerRef>;
  private urlSubscription = this.route.urlChange.subscribe((url) => {
    this.currentUrl = url;
  });

  private routerSubscription = combineLatest([
    this.menuList$,
    this.routerEvents$,
  ]).subscribe(([menuList, routerEvent]) => {
    const routerUrl = routerEvent.url.split('?')[0];
    const menuPath = this.route.currentRoute?.data?.menuPath;
    const menu = menuList.find((m) => {
      return this.comparePathWithRouterUrl(
        this.getPathStr(m.path),
        routerUrl,
        menuPath
      );
    });
    if (menu) {
      const path = this.getPathStr(menu.path);
      const url = path === routerUrl ? `${routerUrl}/${a.LISTAR}` : routerUrl;
      const queryParams = this.route.snapshot.queryParams;
      const extras = Object.keys(queryParams).length ? { queryParams } : {};
      const str = JSON.stringify;
      const currentTabIndex = this.tabs.findIndex(
        (tab) => tab.url === url && str(tab.extras) === str(extras)
      ); 
      if (currentTabIndex === -1) {
        const id = this.route.snapshot.params.id;
        const name = this.getTabNameByMenuAndUrl(menu, url, queryParams, id);
        this.addTab({ name, path, url, extras });
      } else {
        this.setSelectedIndexChange(currentTabIndex);
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
    private location: Location,
    private router: Router,
    private route: ActivatedRouteService,
    private menuService: MenuService,
    private cfr: ComponentFactoryResolver,
  ) {}

  setFrameList(frameList: QueryList<ViewContainerRef> | undefined): void {
    // ACÁ entra cada vez que se setea un nuevo tab
    this.frameList = frameList;
    this.drawComponent();
  }

  setSelectedIndexChange(index: number): void {
    this.selected.setValue(index);
    const currentTab = this.tabs[index];
    this.navigate(currentTab.url, currentTab.extras, index);
  }

  unsubscribe(): void {
    this.routerSubscription.unsubscribe();
    this.urlSubscription.unsubscribe();
  }

  addTab(tab: Tab) {
    this.selected.setValue(this.tabs.length);
    this.tabs.push(tab);
  }

  removeTab(index: number) {
    const currentTab = this.tabs[index];
    const routerUrl = this.currentUrl.split('?')[0];
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
      this.navigate(pathToRedirect, extras);
    }
    this.tabs.splice(index, 1);
  }

  private navigate(url: string, extras?: NavigationExtras, currentTabIndex: number = 0): void {
    const queryParams = extras?.queryParams ?? {};
    const q = this.route.getQueryParamsByObject(queryParams);
    if (`${url}${q}` !== this.currentUrl) {
      this.location.go(url, q);
      const component = this.componentList[currentTabIndex]
      if (component && (component as any).getList)
        {
          (component as any).getList()
        }
    }
  }

  private comparePathWithRouterUrl(
    path: string,
    url: string,
    menuPath?: string
  ): boolean {
    return (
      (url === '/' && path === '/') ||
      (url !== '/' &&
        (menuPath ? path.startsWith(menuPath) : url.startsWith(path)))
    );
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
    const isLiquidacion = this.currentUrl.includes(m.LIQUIDACION);
    const isMovimiento = this.currentUrl.includes(m.MOVIMIENTO);
    const isPuntoVenta = this.currentUrl.includes(m.PUNTO_VENTA);
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
    const proveedorId = this.route.snapshot.params.proveedorId;
    const puntoVentaInfo =
      isPuntoVenta && proveedorId ? ` P: ${proveedorId}` : '';
    if (createRegex.test(url)) {
      return `Crear ${name}${puntoVentaInfo}`;
    } else if (editRegex.test(url)) {
      return `Editar ${name}${etapaInfo}${idInfo}${puntoVentaInfo}`;
    } else if (showRegex.test(url)) {
      return `Ver ${name}${etapaInfo}${idInfo}${puntoVentaInfo}`;
    }
    return `Listar ${name}${etapaInfo}`;
  }

  private drawComponent(): void {

    const url = this.currentUrl;
    const currentTabIndex = this.tabs.findIndex((x) => url.startsWith(x.url));
    const currentURL = this.route.currentRoute;
    const frame = this.frameList?.get(currentTabIndex);
    const component = currentURL?.component;
    console.log("Component", component)
    if (frame && component) {
      frame.clear();
      const cf = this.cfr.resolveComponentFactory(component);
      const comp = frame.createComponent<any>(cf);
      this.componentList.push(comp.instance);
    }
  }
}
