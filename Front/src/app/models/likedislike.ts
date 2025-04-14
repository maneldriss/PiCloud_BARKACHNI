import { User } from './user';
import { Post } from './post';

export interface LikeDislike {
  id: number;
  type: 'LIKE' | 'DISLIKE';
  user: User;
  post: Post;
}
