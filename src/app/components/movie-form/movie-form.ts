import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieDraft } from '../../models/movie';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './movie-form.html',
  styleUrl: './movie-form.css',
})
export class MovieFormComponent {
  @Output() readonly movieAdded = new EventEmitter<MovieDraft>();
  @Output() readonly cancelled = new EventEmitter<void>();

  readonly genres = [
    'Ação',
    'Anime',
    'Comédia',
    'Crime',
    'Drama',
    'Fantasia',
    'Ficção científica',
    'Romance',
    'Suspense',
  ];

  draft: MovieDraft = this.createEmptyDraft();
  posterError = '';

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  selectPoster(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.posterError = '';

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.posterError = 'Escolha um arquivo de imagem.';
      input.value = '';
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      this.posterError = 'A imagem deve ter no máximo 3 MB.';
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.draft.poster = String(reader.result ?? '');
      this.changeDetector.markForCheck();
    };
    reader.onerror = () => {
      this.posterError = 'Não foi possível carregar essa imagem.';
      input.value = '';
      this.changeDetector.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  removePoster(fileInput: HTMLInputElement): void {
    this.draft.poster = '';
    this.posterError = '';
    fileInput.value = '';
  }

  get isValid(): boolean {
    return (
      this.draft.title.trim().length >= 2 &&
      this.draft.description.trim().length >= 10 &&
      this.draft.year >= 1900 &&
      this.draft.year <= 2100 &&
      this.draft.duration.trim().length > 0 &&
      this.draft.rating >= 0 &&
      this.draft.rating <= 10
    );
  }

  submit(): void {
    if (!this.isValid) {
      return;
    }

    this.movieAdded.emit({
      ...this.draft,
      title: this.draft.title.trim(),
      description: this.draft.description.trim(),
      duration: this.draft.duration.trim(),
    });
    this.draft = this.createEmptyDraft();
  }

  private createEmptyDraft(): MovieDraft {
    return {
      title: '',
      description: '',
      year: new Date().getFullYear(),
      genre: 'Drama',
      duration: '',
      rating: 8,
      watched: false,
      poster: '',
    };
  }
}
