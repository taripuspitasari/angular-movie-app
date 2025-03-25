import { Component, inject } from '@angular/core';
import { MoviesService, imagesBaseUrl } from '../../services/movies.service';
import { map } from 'rxjs/operators';
import { SliderComponent } from '../../components/slider/slider.component';
import { MoviesScrollerComponent } from '../../components/movies-scroller/movies-scroller.component';

@Component({
  selector: 'app-home',
  imports: [SliderComponent, MoviesScrollerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private moviesService = inject(MoviesService);
  public imagesBaseUrl = imagesBaseUrl;
  public nowPlayingMovies$ = this.moviesService
    .fetchMoviesByType('now_playing')
    .pipe(map((data) => data.results));

  public popularMovies$ = this.moviesService
    .fetchMoviesByType('popular')
    .pipe(map((data) => data.results));

  public topRatedMovies$ = this.moviesService
    .fetchMoviesByType('top_rated')
    .pipe(map((data) => data.results));
}
