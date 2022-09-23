export interface TransactionalUser {
  id: number | null;
  numero_documento: string | null;
  nombre: string | null;
  apellido: string | null;
  telefono: string | null;
  punto_venta_id: number | null;
  is_activated: boolean | null;
  estado: string | null;
}
