import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Histórias para');
    expect(compiled.querySelector('.movie-grid')?.children.length).toBe(12);
  });

  it('should filter movies by title', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.searchTerm = 'parasita';

    expect(app.filteredMovies.length).toBe(1);
    expect(app.filteredMovies[0].title).toBe('Parasita');
  });

  it('should sort movies by rating without changing the collection order', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const firstMovie = app.movies[0].title;

    app.sortOrder = 'rating';

    expect(app.filteredMovies[0].title).toBe('Breaking Bad');
    expect(app.movies[0].title).toBe(firstMovie);
  });

  it('should toggle the watched status', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const previousStatus = app.movies[4].watched;

    app.toggleWatched(app.movies[4].id);

    expect(app.movies[4].watched).toBe(!previousStatus);
  });

  it('should open and close the movie details', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.openMovieDetails(app.movies[0].id);
    expect(app.selectedMovie?.title).toBe('A Gangue Está em Campo');

    app.closeMovieDetails();
    expect(app.selectedMovie).toBeUndefined();
  });

  it('should add a new movie to the collection', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.addMovie({
      title: 'Central do Brasil',
      year: 1998,
      genre: 'Drama',
      duration: '1h 53min',
      description:
        'Uma professora aposentada atravessa o Brasil ao lado de um menino em busca de sua família.',
      rating: 8.5,
      watched: true,
      poster: 'data:image/png;base64,capa-de-teste',
    });

    expect(app.movies.length).toBe(13);
    // continua em ordem alfabetica: entra depois de Breaking Bad
    expect(app.movies[3].title).toBe('Central do Brasil');
    expect(app.movies[3].poster).toBe('data:image/png;base64,capa-de-teste');
  });

  it('should save a new rating from the details modal', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.openMovieDetails(app.movies[0].id);
    app.ratingDraft = 7.5;
    app.saveRating(app.movies[0].id);

    expect(app.movies[0].rating).toBe(7.5);
  });

  it('should list the titles in alphabetical order', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const titles = app.movies.map((movie) => movie.title);
    const sorted = [...titles].sort((a, b) => a.localeCompare(b, 'pt-BR'));

    expect(titles).toEqual(sorted);
  });
});
