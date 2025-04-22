import { Role } from './role.model';
import { Product } from './product';

export interface User {
[x: string]: any;

    id: number;
    firstname: string;
    lastname: string;
    bio?: string | null;  // Explicitement marqué comme optionnel    profilePicture?: string;
    dateOfBirth?: string | null;
   // plofilePicture?: string | null;
   profilePicture?: string | null; // Conservez l'ancien nom si nécessaire
    email: string;
    accountLocked: boolean;
    enabled: boolean;
    roles: Role[];
    currentlyOnline: boolean;
    lastConnection: string | Date;
    products: Product [];
    latitude: number;
    longitude: number;
  }