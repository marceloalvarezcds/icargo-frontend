import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem } from '../interfaces/menu-item';

@Injectable({
  providedIn: 'root'
})
export class MenuConfigService {

  private menuItemListBehaviorSubject = new BehaviorSubject<MenuItem[]>([]);
  private toggleSidebarMenuBehaviorSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  getMenuItemListObservable(): Observable<MenuItem[]> {
    return this.menuItemListBehaviorSubject.asObservable();
  }

  getToggleSidebarMenuObservable(): Observable<boolean> {
    return this.toggleSidebarMenuBehaviorSubject.asObservable();
  }

  isMenuItemListEmpty(): boolean {
    return this.menuItemListBehaviorSubject.value.length > 0;
  }

  setMenuItemList(menuItemList: MenuItem[]): void {
    setTimeout(() => {
      this.menuItemListBehaviorSubject.next(menuItemList);
    }, 0);
  }

  setSidebarMenu(value: boolean): void {
    this.toggleSidebarMenuBehaviorSubject.next(value);
  }

  toggleSidebarMenu(): void {
    this.setSidebarMenu(!this.toggleSidebarMenuBehaviorSubject.value);
  }
}
