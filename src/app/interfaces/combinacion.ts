import { EstadoEnum } from '../enums/estado-enum';
import {
    GestorCargaPropietario,
    mockGestorCargaPropietarioList,
  } from './gestor-carga-propietario';


export interface Combinacion {
    id: number;
    propietario_id: number;
    camion_id: number;
    semi_id: number;
    chofer_id: number;
    created_by: string;
    created_at: string;
    modified_by: string;
    modified_at: string;
}

