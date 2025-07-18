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
    tipo_persona_id: number;
    created_at: string;
    modified_at: string;
    modified_by: string;
    created_by: string;
  }

  export interface CombinacionList extends Combinacion {
    marca_descripcion: string;
    color_camion: string;
    foto_camion: string;
    camion_marca: string;
    camion_placa: string;
    camion_propietario: string;
    camion_propietario_nombre: string;
    camion_propietario_documento: string;
    limite_cantidad_oc_activas: number;
    camion_oc_activa: number;
    propietario_nombre: string;
    propietario_ruc: string;
    chofer_nombre: string;
    producto_descripcion: string;
    semi_placa: string;
    color_semi: string;
    marca_descripcion_semi: string;
    estado_descripcion: string;
    chofer_numero_documento: number;
    anticipo_propietario: boolean;
    puede_recibir_anticipos: boolean;
    is_chofer_condicionado: boolean;
    is_propietario_condicionado: boolean
  }
