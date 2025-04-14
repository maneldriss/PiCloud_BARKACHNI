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
  likeCount?: number;
  dislikeCount?: number;
}
