export enum RoleName {
    USER = 'USER',
    ADMIN = 'ADMIN',
    MODERATOR = 'MODERATOR'
  }
  
  export interface Role {
    id?: number;
    name: RoleName;
  }