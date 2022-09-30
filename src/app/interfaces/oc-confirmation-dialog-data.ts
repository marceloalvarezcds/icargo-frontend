export interface OCConfirmationInfo {
  flete_id: number;
  remitente: string;
  producto: string;
  origen: string;
  destino: string;
  cantidad_nominada: string;
  camion: string;
  camion_semi_neto: string;
  chofer: string | null;
  propietario: string;
  propietario_tarifa: string;
  propietario_telefono: string | null;
  semi: string;
}

export interface OCConfirmationDialogData {
  oc: OCConfirmationInfo | null;
}

export const mockOCConfirmationInfo: OCConfirmationInfo = {
  flete_id: 0,
  remitente: 'GICAL KM12',
  producto: 'Aceite de Soja',
  origen: 'ITAKYRY',
  destino: 'LA PAZ',
  cantidad_nominada: '10.000',
  camion: 'ABC001',
  camion_semi_neto: '10.000',
  chofer: 'Mengano',
  propietario: 'Fulano',
  propietario_tarifa: '100 PYG/kg',
  propietario_telefono: '0983-500500',
  semi: 'XYZ555',
};

export const mockOCConfirmationDialogData: OCConfirmationDialogData = {
  oc: mockOCConfirmationInfo,
};
