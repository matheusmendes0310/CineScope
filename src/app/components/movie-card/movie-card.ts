import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe, UpperCasePipe } from '@angular/common';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [DecimalPipe, UpperCasePipe],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;
  @Input() posterBroken = false;

  @Output() readonly watchedToggled = new EventEmitter<number>();
  @Output() readonly favoriteToggled = new EventEmitter<number>();
  @Output() readonly removed = new EventEmitter<number>();
  @Output() readonly detailsRequested = new EventEmitter<number>();
  @Output() readonly posterFailed = new EventEmitter<number>();
}
