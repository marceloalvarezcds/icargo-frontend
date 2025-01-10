import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Rol } from 'src/app/interfaces/rol';
import { DialogService } from 'src/app/services/dialog.service';
import { RolService } from 'src/app/services/rol.service';

@Injectable({
  providedIn: 'root',
})
export class RolListService {
  private cols: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: Rol) => element.id,
    },
    {
      def: 'descripcion',
      title: 'Descripción',
      value: (element: Rol) => element.descripcion,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: Rol) => element.estado.toUpperCase(),
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: Rol) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: Rol) => this.formatDate(element.created_at),
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: Rol) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: Rol) => this.formatDate(element.modified_at),
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];
  private lista: Rol[] = [];

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }


  get columns(): Column[] {
    return this.cols;
  }

  get list(): Rol[] {
    return this.lista;
  }

  constructor(
    private router: Router,
    private service: RolService,
    private dialog: DialogService
  ) {}

  getList(): void {
    this.service.getList().subscribe((list) => {
      this.lista = list;
    });
  }

   redirectToCreate(): void {
    this.router.navigate([`/users/${m.ROL}/${a.CREAR}`]);
   }

  redirectToEdit(rol: Rol): void {
    this.router.navigate([`/users/${m.ROL}/${a.EDITAR}`, rol.id]);
   }

  redirectToShow(rol: Rol): void {
    this.router.navigate([`/users/${m.ROL}/${a.VER}`, rol.id]);
   }

  // redirectToCreate(): void {
  //   const url = `/users/${m.ROL}/${a.CREAR}`;
  //   window.open(url, '_blank');
  // }
  
  // redirectToEdit(rol: Rol): void {
  //   const url = `/users/${m.ROL}/${a.EDITAR}/${rol.id}`;
  //   window.open(url, '_blank');
  // }
  
  // redirectToShow(rol: Rol): void {
  //   const url = `/users/${m.ROL}/${a.VER}/${rol.id}`;
  //   window.open(url, '_blank');
  // }

  
  active(user: Rol): void {
    this.dialog.changeStatusConfirm(
      this.changeStatusMessage(user, 'activar'),
      this.service.active(user.id),
      () => {
        this.getList();
      }
    );
  }

  inactive(user: Rol): void {
    this.dialog.changeStatusConfirm(
      this.changeStatusMessage(user, 'desactivar'),
      this.service.inactive(user.id),
      () => {
        this.getList();
      }
    );
  }

  private changeStatusMessage(rol: Rol, accion: string): string {
    return `¿Está seguro que desea ${accion} al rol ${rol.descripcion}?`;
  }
}
