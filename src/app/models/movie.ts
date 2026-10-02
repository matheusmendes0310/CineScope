export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
  duration: string;
  description: string;
  rating: number;
  watched: boolean;
  favorite: boolean;
  accent: string;
  poster: string;
}

export type MovieDraft = Omit<Movie, 'id' | 'favorite' | 'accent' | 'poster'> & {
  poster?: string;
};
