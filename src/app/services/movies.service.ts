import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Movie, Movies } from '../models/movie';
import { map } from 'rxjs';
import { Videos } from '../models/video';
import { Credits } from '../models/credit';
import { Genre, Genres } from '../models/genre';

export const imagesBaseUrl = 'https://image.tmdb.org/t/p/';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = environment.apiKEY;
  private httpClient = inject(HttpClient);

  constructor() {}

  fetchMoviesByType(type: string, pageNumber = 1) {
    return this.httpClient.get<Movies>(
      `${this.apiUrl}/movie/${type}?page=${pageNumber}&api_key=${this.apiKey}`
    );
  }

  fetchMovieBySearch(query: string, pageNumber = 1) {
    const encodedQuery = encodeURIComponent(query);
    return this.httpClient.get<Movies>(
      `${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${encodedQuery}&page=${pageNumber}`
    );
  }

  fetchSimilarMovies(id: string) {
    return this.httpClient
      .get<Movies>(`${this.apiUrl}/movie/${id}/similar?api_key=${this.apiKey}`)
      .pipe(map((data) => data.results));
  }

  fetchMovieById(id: string) {
    return this.httpClient.get<Movie>(
      `${this.apiUrl}/movie/${id}?api_key=${this.apiKey}`
    );
  }

  fetchMovieVideos(id: string) {
    return this.httpClient
      .get<Videos>(`${this.apiUrl}/movie/${id}/videos?api_key=${this.apiKey}`)
      .pipe(map((data) => data.results));
  }

  fetchMovieCast(id: string) {
    return this.httpClient
      .get<Credits>(`${this.apiUrl}/movie/${id}/credits?api_key=${this.apiKey}`)
      .pipe(map((data) => data.cast));
  }

  fetchMovieGenres() {
    return this.httpClient
      .get<Genres>(
        `${this.apiUrl}/genre/movie/list?api_key=${this.apiKey}&language=en-US`
      )
      .pipe(map((response) => response.genres));
  }

  fetchMoviesByGenre(genreId: number, pageNumber = 1) {
    return this.httpClient.get<Movies>(
      `${this.apiUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}&page=${pageNumber}`
    );
  }
}
