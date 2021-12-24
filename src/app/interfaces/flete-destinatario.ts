import { FleteDestinatarioEnum } from 'src/app/enums/flete-destinatario-enum';
import { mockCentroOperativoContactoGestorCargaList } from './centro-operativo-contacto-gestor-carga';
import { mockRemitenteContactoGestorCargaList } from './remitente-contacto-gestor-carga';
import { mockUser } from './user';

export interface FleteDestinatario {
  id: number;
  tipo_destinatario: FleteDestinatarioEnum;
  email: string;
  nombre: string;
}

const destino = mockCentroOperativoContactoGestorCargaList[0];
const origen = mockCentroOperativoContactoGestorCargaList[1];
const remitente = mockRemitenteContactoGestorCargaList[1];
const usuario = mockUser

export const mockFleteDestinatarioList: FleteDestinatario[] = [
  {
    id: destino.id!,
    tipo_destinatario: FleteDestinatarioEnum.CENTRO_OPERATIVO,
    email: destino.contacto_email,
    nombre: `${destino.contacto_nombre} ${destino.contacto_apellido}`,
  },
  {
    id: origen.id!,
    tipo_destinatario: FleteDestinatarioEnum.CENTRO_OPERATIVO,
    email: origen.contacto_email,
    nombre: `${origen.contacto_nombre} ${origen.contacto_apellido}`,
  },
  {
    id: remitente.id!,
    tipo_destinatario: FleteDestinatarioEnum.REMITENTE,
    email: remitente.contacto_email,
    nombre: `${remitente.contacto_nombre} ${remitente.contacto_apellido}`,
  },
  {
    id: usuario.id,
    tipo_destinatario: FleteDestinatarioEnum.USUARIO,
    email: usuario.email,
    nombre: `${usuario.first_name} ${usuario.last_name}`,
  },
];
