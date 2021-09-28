export interface CentroOperativo {
  nombre: string;
  nombre_corto: string;
  direccion: string;
  ciudad: string;
  localidad: string;
  pais: string;
  clasificacion: string;
  moderado: string;
  logo: string;
}

export const mockCentroOperativoList: CentroOperativo[] = [
  {
    nombre: "Puerto Unión",
    nombre_corto: "Centro Operativo",
    direccion: "Puerto Union gral.",
    ciudad: "Asunción",
    localidad: "Central",
    pais: "Paraguay",
    clasificacion: "Puerto multimodal",
    moderado: "Admin",
    logo: "",
  },
  {
    nombre: "CARGILL_NUEVA TOLEDO",
    nombre_corto: "Centro Operativo",
    direccion: "Carlos A. López Toledo",
    ciudad: "Asunción",
    localidad: "Central",
    pais: "Paraguay",
    clasificacion: "Silo",
    moderado: "Admin",
    logo: "",
  },
];
