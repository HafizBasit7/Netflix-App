export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
  }
  
  export interface MovieDetails extends Movie {
    genres: Genre[];
    runtime: number;
    budget: number;
    revenue: number;
    status: string;
    tagline: string;
  }
  
  export interface Genre {
    id: number;
    name: string;
  }
  
  export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
  }