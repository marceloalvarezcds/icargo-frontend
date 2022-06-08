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
    const url = routerEvent.url;
    const menu = menuList.find((m) => {
      return this.compareMenuPathWithRouterUrl(m, url);
    });
    console.log(routerEvent, menu);
    if (menu) {
      const name = this.getTabNameByMenuAndUrl(menu, url);
      const find = this.tabs.some((m) => m.name === name);
      if (!find) {
        this.addTab({ name, url });
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
    this.tabs.splice(index, 1);
  }

  private compareMenuPathWithRouterUrl(menu: MenuItem, url: string): boolean {
    const path = Array.isArray(menu.path) ? menu.path.join('/') : menu.path!;
    const pathRegex = new RegExp(path);
    const urlRegex = new RegExp(url);
    return pathRegex.test(url) || urlRegex.test(path);
  }

  private getTabNameByMenuAndUrl(menu: MenuItem, url: string): string {
    const createRegex = new RegExp(a.CREAR);
    const editRegex = new RegExp(a.EDITAR);
    const showRegex = new RegExp(a.VER);
    if (createRegex.test(url)) {
      return `Crear ${menu.name}`;
    } else if (editRegex.test(url)) {
      return `Editar ${menu.name}`;
    } else if (showRegex.test(url)) {
      return `Ver ${menu.name}`;
    }
    return `Listar ${menu.name}`;
  }
}
