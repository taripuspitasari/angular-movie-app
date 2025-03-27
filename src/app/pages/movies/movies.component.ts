import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { AsyncPipe } from '@angular/common';
import { Movie } from '../../models/movie';
import { MovieComponent } from '../../components/movie/movie.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-movies',
  imports: [MovieComponent, InfiniteScrollDirective, AsyncPipe],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css',
})
export class MoviesComponent {
  searchQuery = signal('');
  private moviesService = inject(MoviesService);
  private pageNumber = 1;
  private destroyRef = inject(DestroyRef);
  public genres$ = this.moviesService.fetchMovieGenres();
  public moviesResults: Movie[] = [];

  ngOnInit() {
    this.getAllMovies();
  }

  getAllMovies() {
    this.moviesService
      .fetchMoviesByType('popular', this.pageNumber)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.moviesResults = data.results;
      });
  }

  onScroll(): void {
    this.pageNumber++;

    let movies$;

    if (this.searchQuery()) {
      movies$ = this.moviesService.fetchMovieBySearch(
        this.searchQuery(),
        this.pageNumber
      );
    } else {
      movies$ = this.moviesService.fetchMoviesByType(
        'popular',
        this.pageNumber
      );
    }
    console.log(this.pageNumber);
    movies$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      const newMovies = data.results.filter(
        (movie) => !this.moviesResults.some((m) => m.id === movie.id)
      );
      this.moviesResults = [...this.moviesResults, ...newMovies];
    });
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.updateSearch(input.value);
  }

  updateSearch(query: string) {
    this.searchQuery.set(query);
    this.moviesService
      .fetchMovieBySearch(this.searchQuery())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.moviesResults = data.results;
      });
  }

  onGenreChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.moviesService
      .fetchMoviesByGenre(Number(selectedValue))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.moviesResults = data.results;
      });
  }
}
