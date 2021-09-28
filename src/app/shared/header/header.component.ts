import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MenuConfigService } from 'src/app/services/menu-config.service';
import { SearchService } from 'src/app/services/search.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  userObservable$ = this.userService.getLoggedUser();

  constructor(
    public menuConfigService: MenuConfigService,
    public searchService: SearchService,
    private authService: AuthService,
    private userService: UserService,
  ) { }

  logout(): void {
    this.authService.logout();
  }

  toggleSidebarMenu(): void {
    this.menuConfigService.toggleSidebarMenu();
  }
}
