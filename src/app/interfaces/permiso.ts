import { PermisoAccionEnum, PermisoModeloEnum } from "../enums/permiso-enum";

export interface Permiso {
  id: number;
  accion: PermisoAccionEnum;
  modelo: PermisoModeloEnum;
  autorizado: boolean;
  descripcion: string;
}

export const mockPermisoList: Permiso[] = [
  {
    id: 1,
    accion: PermisoAccionEnum.VER,
    modelo: PermisoModeloEnum.USER,
    autorizado: true,
    descripcion: 'Ver usuario',
  },
  {
    id: 2,
    accion: PermisoAccionEnum.REPORTE,
    modelo: PermisoModeloEnum.CENTRO_OPERATIVO,
    autorizado: true,
    descripcion: 'Reporte de Centro Operativo',
  },
  {
    id: 3,
    accion: PermisoAccionEnum.REPORTE,
    modelo: PermisoModeloEnum.GESTOR_CARGA,
    autorizado: true,
    descripcion: 'Reporte de Gestor de Carga',
  },
  {
    id: 4,
    accion: PermisoAccionEnum.REPORTE,
    modelo: PermisoModeloEnum.PROVEEDOR,
    autorizado: true,
    descripcion: 'Reporte de Proveedor',
  },
  {
    id: 5,
    accion: PermisoAccionEnum.REPORTE,
    modelo: PermisoModeloEnum.PUNTO_VENTA,
    autorizado: true,
    descripcion: 'Reporte de Punto de Venta',
  },
  {
    id: 6,
    accion: PermisoAccionEnum.REPORTE,
    modelo: PermisoModeloEnum.REMITENTE,
    autorizado: true,
    descripcion: 'Reporte de Remitente',
  },
  {
    id: 7,
    accion: PermisoAccionEnum.LISTAR,
    modelo: PermisoModeloEnum.PUNTO_VENTA,
    autorizado: true,
    descripcion: 'Crear Punto de Venta',
  },
  {
    id: 8,
    accion: PermisoAccionEnum.CREAR,
    modelo: PermisoModeloEnum.PUNTO_VENTA,
    autorizado: true,
    descripcion: 'Crear Punto de Venta',
  },
];
