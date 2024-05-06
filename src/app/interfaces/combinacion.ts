import { User } from '@sentry/angular';
import { EstadoEnum } from '../enums/estado-enum';
import { Camion } from './camion';
import { CamionSemiNeto } from './camion-semi-neto';
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
    propietario_id: number;
    camion_id: number;
    semi_id: number;
    chofer_id: number;
    chofer: Chofer
    camion: Camion
    camion_marca: Camion
    camion_neto: CamionSemiNeto
    producto: Producto
    semi: Semi
    propietario: Propietario
    usuario: User
    estado: EstadoEnum
    created_by: string;
    created_at: string;
    modified_by: string;
    modified_at: string;
}

