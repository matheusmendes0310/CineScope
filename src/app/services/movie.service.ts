import { Injectable } from '@angular/core';
import { Movie, MovieDraft } from '../models/movie';

@Injectable({ providedIn: 'root' })
export class MovieService {
  // lista inicial de filmes e séries (fica so na memoria, se recarregar a pagina volta ao normal)
  private movies: Movie[] = this.sortByTitle([
    {
      id: 1,
      title: 'A Gangue Está em Campo',
      year: 2006,
      genre: 'Drama',
      duration: '2h 05min',
      description:
        'Um agente de um centro de detenção juvenil monta um time de futebol americano com os internos para dar a eles disciplina e uma nova chance.',
      rating: 7.4,
      watched: true,
      favorite: false,
      accent: '#3b7fc4',
      poster: 'posters/a-gangue-esta-em-campo.jpg',
    },
    {
      id: 2,
      title: 'Attack on Titan',
      year: 2013,
      genre: 'Anime',
      duration: '4 temporadas',
      description:
        'Depois que titãs gigantes destroem sua cidade, Eren Yeager entra para o exército para lutar contra eles e descobrir a verdade sobre o mundo.',
      rating: 9.1,
      watched: true,
      favorite: true,
      accent: '#7a6a58',
      poster: 'posters/attack-on-titan.jpg',
    },
    {
      id: 3,
      title: 'Breaking Bad',
      year: 2008,
      genre: 'Crime',
      duration: '5 temporadas',
      description:
        'Um professor de química passa a produzir metanfetamina com um ex-aluno para garantir o futuro da família e aos poucos vira outra pessoa.',
      rating: 9.5,
      watched: true,
      favorite: true,
      accent: '#4f8a4c',
      poster: 'posters/breaking-bad.jpg',
    },
    {
      id: 4,
      title: 'Death Note',
      year: 2006,
      genre: 'Anime',
      duration: '37 episódios',
      description:
        'Light Yagami encontra um caderno que mata qualquer pessoa cujo nome seja escrito nele e começa a ser caçado pelo detetive L.',
      rating: 9,
      watched: true,
      favorite: true,
      accent: '#3a3f4b',
      poster: 'posters/death-note.jpg',
    },
    {
      id: 5,
      title: 'Game of Thrones',
      year: 2011,
      genre: 'Fantasia',
      duration: '8 temporadas',
      description:
        'Famílias nobres disputam o Trono de Ferro dos Sete Reinos enquanto uma ameaça antiga desperta além da Muralha.',
      rating: 8.9,
      watched: false,
      favorite: false,
      accent: '#5b6f86',
      poster: 'posters/game-of-thrones.jpg',
    },
    {
      id: 6,
      title: 'Gente Grande',
      year: 2010,
      genre: 'Comédia',
      duration: '1h 42min',
      description:
        'Cinco amigos de infância se reencontram depois da morte do antigo treinador de basquete e passam o feriado com as famílias numa casa no lago.',
      rating: 7,
      watched: true,
      favorite: false,
      accent: '#e0913f',
      poster: 'posters/gente-grande.jpg',
    },
    {
      id: 7,
      title: 'Homem de Ferro 2',
      year: 2010,
      genre: 'Ação',
      duration: '2h 04min',
      description:
        'Tony Stark é pressionado a entregar sua armadura ao governo enquanto Ivan Vanko cria uma arma baseada na mesma tecnologia.',
      rating: 7.3,
      watched: true,
      favorite: false,
      accent: '#b94747',
      poster: 'posters/homem-de-ferro-2.jpg',
    },
    {
      id: 8,
      title: 'Interestelar',
      year: 2014,
      genre: 'Ficção científica',
      duration: '2h 49min',
      description:
        'Com a Terra em colapso, um ex-piloto atravessa um buraco de minhoca em busca de um novo lar para a humanidade.',
      rating: 9.2,
      watched: true,
      favorite: true,
      accent: '#e99562',
      poster: 'posters/interestelar.jpg',
    },
    {
      id: 9,
      title: 'La Casa de Papel',
      year: 2017,
      genre: 'Suspense',
      duration: '5 partes',
      description:
        'Um homem conhecido como Professor reúne um grupo de criminosos para executar o maior assalto da história da Espanha.',
      rating: 8.3,
      watched: false,
      favorite: true,
      accent: '#c0392b',
      poster: 'posters/la-casa-de-papel.jpg',
    },
    {
      id: 10,
      title: 'Parasita',
      year: 2019,
      genre: 'Suspense',
      duration: '2h 12min',
      description:
        'Uma família com dificuldades se aproxima de uma casa rica, mas o plano revela segredos e conflitos entre classes sociais.',
      rating: 9,
      watched: true,
      favorite: true,
      accent: '#6f826f',
      poster: 'posters/parasita.jpg',
    },
    {
      id: 11,
      title: 'Spider-Man: Brand New Day',
      year: 2026,
      genre: 'Ação',
      duration: '2h 25min',
      description:
        'Em um mundo que não se lembra de Peter Parker, o herói combate o crime em tempo integral e enfrenta uma nova ameaça.',
      rating: 8.5,
      watched: false,
      favorite: true,
      accent: '#b94747',
      poster: 'posters/spider-man-brand-new-day.jpg',
    },
    {
      id: 12,
      title: 'Vingadores: Ultimato',
      year: 2019,
      genre: 'Ação',
      duration: '3h 01min',
      description:
        'Após a devastação causada por Thanos, os heróis restantes se reúnem para uma última tentativa de restaurar o universo.',
      rating: 9.1,
      watched: true,
      favorite: true,
      accent: '#655183',
      poster: 'posters/vingadores-ultimato.jpg',
    },
  ]);

  getMovies(): Movie[] {
    return [...this.movies];
  }

  addMovie(draft: MovieDraft): void {
    const accents: Record<string, string> = {
      Ação: '#b94747',
      Anime: '#7a6a58',
      Comédia: '#e0913f',
      Crime: '#4f8a4c',
      Drama: '#3b7fc4',
      Fantasia: '#5b6f86',
      'Ficção científica': '#6f93a4',
      Romance: '#b97887',
      Suspense: '#6f826f',
    };
    const nextId = Math.max(0, ...this.movies.map((movie) => movie.id)) + 1;

    // coloca o novo e reordena pra lista continuar em ordem alfabetica
    this.movies = this.sortByTitle([
      ...this.movies,
      {
        ...draft,
        id: nextId,
        favorite: false,
        accent: accents[draft.genre] ?? '#3b97e3',
        poster: draft.poster ?? '',
      },
    ]);
  }

  removeMovie(movieId: number): void {
    this.movies = this.movies.filter((movie) => movie.id !== movieId);
  }

  toggleWatched(movieId: number): void {
    this.updateMovie(movieId, (movie) => ({ ...movie, watched: !movie.watched }));
  }

  toggleFavorite(movieId: number): void {
    this.updateMovie(movieId, (movie) => ({ ...movie, favorite: !movie.favorite }));
  }

  setRating(movieId: number, rating: number): void {
    this.updateMovie(movieId, (movie) => ({ ...movie, rating }));
  }

  private sortByTitle(list: Movie[]): Movie[] {
    return [...list].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
  }

  private updateMovie(movieId: number, update: (movie: Movie) => Movie): void {
    this.movies = this.movies.map((movie) => (movie.id === movieId ? update(movie) : movie));
  }
}
