import { User } from './user';

export interface Commentaire {
  idCommentaire: number;
  content: string;
  createdAt?: string;
  post?: {
    idPost: number;
    // autres propriétés si nécessaire
  };
  user?: User;
  // Pour l'édition frontend
  editing?: boolean;
  updatedContent?: string;
}
