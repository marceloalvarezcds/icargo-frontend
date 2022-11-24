import { Component, OnInit } from '@angular/core';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { TableEvent } from 'src/app/interfaces/table';
import { User } from 'src/app/interfaces/user';
import { UserListService } from './user-list.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [UserListService],
})
export class UserListComponent implements OnInit {
  modelo = m.USER;
  submodule = 'Usuario';

  get columns(): Column[] {
    return this.service.columns;
  }

  get list(): User[] {
    return this.service.list;
  }

  constructor(private service: UserListService) {}

  ngOnInit(): void {
    this.service.getList();
  }

  redirectToCreate(): void {
    this.service.redirectToCreate();
  }

  redirectToEdit({ row }: TableEvent<User>): void {
    this.service.redirectToEdit(row);
  }

  redirectToShow({ row }: TableEvent<User>): void {
    this.service.redirectToShow(row);
  }

  active({ row }: TableEvent<User>): void {
    this.service.active(row);
  }

  inactive({ row }: TableEvent<User>): void {
    this.service.inactive(row);
  }
}
