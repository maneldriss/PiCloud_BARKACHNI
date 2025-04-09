export interface User {
    id: number;
    firstname: string;
    lastname: string;
    bio?: string;
    profilePicture?: string;
    dateOfBirth: string;
    email: string;
    accountLocked: boolean;
    enabled: boolean;
    roles: string[];
  }