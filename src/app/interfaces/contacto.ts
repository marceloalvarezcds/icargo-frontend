export interface Cargo {
  id: number;
  descripcion: string;
}

export interface Contacto {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  cargo: Cargo;
}

export const mockCargoList: Cargo[] = [
  {
    id: 1,
    descripcion: 'Gerente',
  },
  {
    id: 2,
    descripcion: 'Vendedor',
  },
];

export const mockContacto: Contacto = {
  id: 1,
  nombre: 'Fulano',
  apellido: 'De Tal',
  telefono: '0981100100',
  email: 'fulano@detal.com',
  cargo: {
    id:  1,
    descripcion: 'Gerente',
  },
};
