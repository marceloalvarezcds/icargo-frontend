import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PermisoAccionEnum as a } from 'src/app/enums/permiso-enum';
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
    const routerUrl = routerEvent.url;
    const dArray = routerEvent.url.match(/\d+/);
    const id = dArray && dArray.length ? parseInt(dArray[0], 10) : undefined;
    const menu = menuList.find((m) => {
      return this.comparePathWithRouterUrl(this.getPathStr(m.path), routerUrl);
    });
    if (menu) {
      const path = this.getPathStr(menu.path);
      const url = path === routerUrl ? `${routerUrl}/${a.LISTAR}` : routerUrl;
      const name = this.getTabNameByMenuAndUrl(menu, url, id);
      const find = this.tabs.some((m) => m.url === url);
      if (!find) {
        this.addTab({ name, path, url });
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

  constructor(private router: Router, private menuService: MenuService) {}

  unsubscribe(): void {
    this.routerSubscription.unsubscribe();
  }

  addTab(tab: Tab) {
    this.tabs.push(tab);
  }

  removeTab(index: number) {
    const url = this.tabs[index].url;
    if (url === this.router.url) {
      const path = this.tabs[index].path;
      const previousTab = index > 0 ? this.tabs[index - 1] : undefined;
      const previousPath = previousTab ? previousTab.path : '/';
      const pathToRedirect =
        `${path}/${a.LISTAR}` === url ? previousPath : path;
      this.router.navigateByUrl(pathToRedirect);
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
    id: number | undefined
  ): string {
    const createRegex = new RegExp(a.CREAR);
    const editRegex = new RegExp(a.EDITAR);
    const showRegex = new RegExp(a.VER);
    const idInfo = id ? ` Nº ${id}` : '';
    if (createRegex.test(url)) {
      return `Crear ${menu.name}`;
    } else if (editRegex.test(url)) {
      return `Editar ${menu.name}${idInfo}`;
    } else if (showRegex.test(url)) {
      return `Ver ${menu.name}${idInfo}`;
    }
    return `Listar ${menu.name}`;
  }
}
