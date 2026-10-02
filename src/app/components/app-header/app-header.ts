import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeaderComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) totalMovies = 0;
  @Input({ required: true }) watchedMovies = 0;
  @Input({ required: true }) averageRating = '0,0';
}
