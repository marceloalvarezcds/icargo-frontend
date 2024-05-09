
import { EstadoEnum } from '../enums/estado-enum';
import { Camion } from './camion';
import { CamionSemiNeto } from './camion-semi-neto';
import { Chofer } from './chofer';
import { Producto } from './producto';
import { Propietario } from './propietario';
import { Semi } from './semi';


export interface Combinacion {
    id: number;
    estado: EstadoEnum;
    propietario_id: number;
    camion_id: number;
    chofer_id: number;
    producto_id: number;
    gestor_carga_id: number;
    neto: number;
    semi_id: number;
    comentario: number;
    capacidad_total_combinacion: number;
    camion: Camion;
    semi: Semi;
    propietario: Propietario;
    chofer: Chofer
    producto: Producto
    created_at: string;
    modified_at: string;
    created_by: string;
}

