import { User } from './user';
import { Commentaire } from './commentaire';

export interface Post {
  idPost: number;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
  commentaires?: Commentaire[];
  likes?: number;      // Nombre total de likes
  dislikes?: number;   // Nombre total de dislikes
  commentCount?: number; // Nombre total de commentaires
}
