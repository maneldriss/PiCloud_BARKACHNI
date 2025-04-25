import { Role } from './role.model';
export interface User {
[x: string]: any;

    id: number;
    firstname: string;
    lastname: string;
    bio?: string | null;  // Explicitement marqué comme optionnel    profilePicture?: string;
    dateOfBirth?: string | null;
    donationPoints?:number;
   // plofilePicture?: string | null;
   profilePicture?: string | null; // Conservez l'ancien nom si nécessaire
    email: string;
    accountLocked: boolean;
    enabled: boolean;
    roles: Role[];
    currentlyOnline: boolean;
    lastConnection: string | Date;
    latitude: number;
    longitude: number;
  }