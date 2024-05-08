import { User } from '@sentry/angular';
import { EstadoEnum } from '../enums/estado-enum';
import { Camion } from './camion';
import { CamionSemiNeto, CamionSemiNetoForm } from './camion-semi-neto';
import { Chofer } from './chofer';
import {
    GestorCargaPropietario,
    mockGestorCargaPropietarioList,
  } from './gestor-carga-propietario';
import { Producto } from './producto';
import { Propietario } from './propietario';
import { Semi } from './semi';


export interface Combinacion {
    id: number;
    estado: EstadoEnum;
    propietario_id: number;
    camion_id: number;
    chofer_id: number;
    semi_id: number;
    comentario: number;
    capacidad_total_combinacion: number;
    camion: Camion;
    semi: Semi;
    propietario: Propietario;
    chofer: Chofer
    camion_semi_neto: CamionSemiNeto
    usuario: User
    modified_at: string;
}

