export interface Contacto {
  id?: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
}

export const mockContacto: Contacto = {
  id: 1,
  nombre: 'Fulano',
  apellido: 'De Tal',
  telefono: '0981100100',
  email: 'fulano@detal.com',
};
