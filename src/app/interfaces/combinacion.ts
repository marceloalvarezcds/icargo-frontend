import { EstadoEnum } from '../enums/estado-enum';
import { Camion } from './camion';
import { Chofer } from './chofer';
import { Producto } from './producto';
import { Propietario } from './propietario';
import { Semi } from './semi';


export interface Combinacion {
    id: number;
    estado: EstadoEnum;
    propietario_id: number;
    chofer_id: number;
    camion_id: number;
    producto_id: number;
    gestor_carga_id: number;
    neto: number;
    semi_id: number;
    comentario: number;
    semi: Semi;
    propietario: Propietario;
    chofer: Chofer;
    producto: Producto;
    camion: Camion;
    created_at: string;
    modified_at: string;
    modified_by: string;
    created_by: string;
  }
  
  export interface CombinacionList extends Combinacion {
    propietario_nombre: string;
    chofer_nombre: string;
    marca_descripcion: string;
    marca_descripcion_semi: string;
    producto_descripcion: string; 
    semi_placa: string;
    color_semi: string;
    estado_descripcion: string;
    foto_camion: string;
    camion_marca: string;
    camion_placa: string;
    limite_cantidad_oc_activas: number;
    camion_oc_activa: number;
  }
  