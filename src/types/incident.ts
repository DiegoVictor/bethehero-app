export interface IIncident {
  id: number;
  title: string;
  description: string;
  value: number;
  ngo: {
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
}
