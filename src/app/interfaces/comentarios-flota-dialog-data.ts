export interface ComentariosFlota {
  comentable_id: number
  comentable_type: string;
  tipo_evento: string;
  comentario: string
  archivo: string
}


export interface ComentariosFlotaList extends ComentariosFlota {
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;

}
