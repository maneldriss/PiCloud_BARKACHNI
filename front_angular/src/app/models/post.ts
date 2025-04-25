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
  isPlaying?: boolean;
  volume?: number;
  videoError?: string;
  commentaires?: Commentaire[];
  likeCount?: number;
  dislikeCount?: number;
}
