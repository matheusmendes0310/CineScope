import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppHeaderComponent } from './components/app-header/app-header';
import { MovieCardComponent } from './components/movie-card/movie-card';
import { MovieFormComponent } from './components/movie-form/movie-form';
import { Movie, MovieDraft } from './models/movie';
import { MovieService } from './services/movie.service';

type LibraryView = 'all' | 'favorites';
type SortOrder = 'collection' | 'rating' | 'newest';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, AppHeaderComponent, MovieCardComponent, MovieFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly title = 'CineScope';
  readonly subtitle = 'Seus filmes, séries e animes favoritos em um só lugar';

  searchTerm = '';
  selectedGenre = 'Todos';
  sortOrder: SortOrder = 'collection';
  activeView: LibraryView = 'all';
  showForm = false;
  feedbackMessage = '';
  selectedMovieId: number | null = null;
  brokenPosters: number[] = [];
  ratingDraft = 0;
  movies: Movie[];

  constructor(private readonly movieService: MovieService) {
    this.movies = this.movieService.getMovies();
  }

  get genres(): string[] {
    return ['Todos', ...new Set(this.movies.map((movie) => movie.genre))];
  }

  get filteredMovies(): Movie[] {
    const normalizedSearch = this.searchTerm.trim().toLocaleLowerCase('pt-BR');

    const matches = this.movies.filter((movie) => {
      const matchesSearch = movie.title.toLocaleLowerCase('pt-BR').includes(normalizedSearch);
      const matchesGenre = this.selectedGenre === 'Todos' || movie.genre === this.selectedGenre;
      const matchesView = this.activeView === 'all' || movie.favorite;

      return matchesSearch && matchesGenre && matchesView;
    });

    // copia antes de ordenar pra nao baguncar a ordem original da lista
    return [...matches].sort((first, second) => {
      if (this.sortOrder === 'rating') {
        return second.rating - first.rating;
      }

      if (this.sortOrder === 'newest') {
        return second.year - first.year;
      }

      return 0;
    });
  }

  get watchedCount(): number {
    return this.movies.filter((movie) => movie.watched).length;
  }

  get favoriteCount(): number {
    return this.movies.filter((movie) => movie.favorite).length;
  }

  get averageRating(): string {
    if (this.movies.length === 0) {
      return '0,0';
    }

    const total = this.movies.reduce((sum, movie) => sum + movie.rating, 0);
    return (total / this.movies.length).toFixed(1).replace('.', ',');
  }

  get resultLabel(): string {
    const total = this.filteredMovies.length;
    return `${total} ${total === 1 ? 'título encontrado' : 'títulos encontrados'}`;
  }

  get hasActiveFilters(): boolean {
    return (
      this.searchTerm.trim() !== '' ||
      this.selectedGenre !== 'Todos' ||
      this.sortOrder !== 'collection' ||
      this.activeView !== 'all'
    );
  }

  get hasSearchOrGenreFilter(): boolean {
    return this.searchTerm.trim() !== '' || this.selectedGenre !== 'Todos';
  }

  get selectedMovie(): Movie | undefined {
    return this.movies.find((movie) => movie.id === this.selectedMovieId);
  }

  setView(view: LibraryView): void {
    this.activeView = view;
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  openMovieDetails(movieId: number): void {
    this.selectedMovieId = movieId;
    this.ratingDraft = this.selectedMovie?.rating ?? 0;
  }

  closeMovieDetails(): void {
    this.selectedMovieId = null;
  }

  @HostListener('document:keydown.escape')
  closeDetailsWithEscape(): void {
    this.closeMovieDetails();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedGenre = 'Todos';
    this.sortOrder = 'collection';
    this.activeView = 'all';
    this.feedbackMessage = 'Filtros removidos. Exibindo toda a coleção.';
  }

  // chamado pelo botao "marcar como assistido" do card
  toggleWatched(movieId: number): void {
    const movie = this.movies.find((item) => item.id === movieId);
    this.movieService.toggleWatched(movieId);
    this.refreshMovies();

    if (movie) {
      this.feedbackMessage = movie.watched
        ? `"${movie.title}" voltou para a lista Quero assistir.`
        : `"${movie.title}" foi marcado como Já assisti.`;
    }
  }

  // botao de coracao do card
  toggleFavorite(movieId: number): void {
    const movie = this.movies.find((item) => item.id === movieId);
    this.movieService.toggleFavorite(movieId);
    this.refreshMovies();

    if (movie) {
      this.feedbackMessage = movie.favorite
        ? `"${movie.title}" foi removido dos favoritos.`
        : `"${movie.title}" foi adicionado aos favoritos.`;
    }
  }

  // botao X do card, tira o filme da lista
  removeMovie(movieId: number): void {
    const movie = this.movies.find((item) => item.id === movieId);
    this.movieService.removeMovie(movieId);
    this.refreshMovies();

    if (movie) {
      this.feedbackMessage = `"${movie.title}" foi removido da coleção.`;
    }
  }

  // recebe o filme novo que vem do formulario (evento movieAdded)
  addMovie(draft: MovieDraft): void {
    this.movieService.addMovie(draft);
    this.refreshMovies();
    this.clearFilters();
    this.showForm = false;
    this.feedbackMessage = `"${draft.title}" foi adicionado à coleção.`;
  }

  // slider do modal, a nota so muda quando clica em salvar
  saveRating(movieId: number): void {
    const movie = this.movies.find((item) => item.id === movieId);
    this.movieService.setRating(movieId, this.ratingDraft);
    this.refreshMovies();

    if (movie) {
      this.feedbackMessage = `Nota de "${movie.title}" alterada para ${this.formatRating(this.ratingDraft)}.`;
    }
  }

  formatRating(rating: number): string {
    return rating.toFixed(1).replace('.', ',');
  }

  // se a imagem do cartaz nao existir, mostra a capa desenhada no lugar
  markPosterBroken(movieId: number): void {
    if (!this.brokenPosters.includes(movieId)) {
      this.brokenPosters = [...this.brokenPosters, movieId];
    }
  }

  dismissFeedback(): void {
    this.feedbackMessage = '';
  }

  private refreshMovies(): void {
    this.movies = this.movieService.getMovies();
  }
}
