
import { EstadoEnum } from '../enums/estado-enum';
import { Camion } from './camion';
import { Chofer } from './chofer';
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
    created_at: string;
    modified_at: string;
    created_by: string;
}

