import { Component, OnInit } from '@angular/core';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Rol } from 'src/app/interfaces/rol';
import { TableEvent } from 'src/app/interfaces/table';
import { RolListService } from './rol-list.service';

@Component({
  selector: 'app-rol-list',
  templateUrl: './rol-list.component.html',
  styleUrls: ['./rol-list.component.scss'],
  providers: [RolListService],
})
export class RolListComponent implements OnInit {
  modelo = m.USER;
  submodule = 'Usuario';

  get columns(): Column[] {
    return this.service.columns;
  }

  get list(): Rol[] {
    return this.service.list;
  }

  constructor(private service: RolListService) {}

  ngOnInit(): void {
    this.service.getList();
  }

  redirectToCreate(): void {
    this.service.redirectToCreate();
  }

  redirectToEdit({ row }: TableEvent<Rol>): void {
    this.service.redirectToEdit(row);
  }

  redirectToShow({ row }: TableEvent<Rol>): void {
    this.service.redirectToShow(row);
  }

  active({ row }: TableEvent<Rol>): void {
    this.service.active(row);
  }

  inactive({ row }: TableEvent<Rol>): void {
    this.service.inactive(row);
  }
}
