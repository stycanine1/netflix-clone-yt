import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { BannerComponent } from 'src/app/core/components/banner/banner.component';
import { MovieService } from 'src/app/shared/services/movie.service';
import { MovieCarouselComponent } from 'src/app/shared/components/movie-carousel/movie-carousel.component';
import { IVideoContent } from 'src/app/shared/models/video-content.interface';
import { Observable, forkJoin, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, HeaderComponent, BannerComponent, MovieCarouselComponent],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {

  movieService = inject(MovieService);
  userProfileImg = 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500';
  bannerDetail$ = new Observable<any>();
  bannerVideo$ = new Observable<any>();

  movies: IVideoContent[] = [];
  tvShows: IVideoContent[] = [];
  ratedMovies: IVideoContent[] = [];
  nowPlayingMovies: IVideoContent[] = [];
  popularMovies: IVideoContent[] = [];
  topRatedMovies: IVideoContent[] = [];
  upcomingMovies: IVideoContent[] = [];

  ngOnInit(): void {
    // First get guest session, then fetch all data
    this.movieService.getNewGuestSession()
      .pipe(
        switchMap((guestSession: any) => {
          const guestSessionId = guestSession.guest_session_id;
          
          const sources = [
            this.movieService.getMovies(),
            this.movieService.getTvShows(),
            this.movieService.getRatedMovies(guestSessionId),
            this.movieService.getNowPlayingMovies(),
            this.movieService.getUpcomingMovies(),
            this.movieService.getPopularMovies(),
            this.movieService.getTopRated()
          ];

          return forkJoin(sources);
        }),
        map(([movies, tvShows, ratedMovies, nowPlaying, upcoming, popular, topRated])=>{
          this.bannerDetail$ = this.movieService.getBannerDetail(movies.results[1].id);
          this.bannerVideo$ = this.movieService.getBannerVideo(movies.results[1].id);
          return {movies, tvShows, ratedMovies, nowPlaying, upcoming, popular, topRated}
        })
      ).subscribe((res:any)=>{
        this.movies = res.movies.results as IVideoContent[];
        this.tvShows = res.tvShows.results as IVideoContent[];
        this.ratedMovies = res.ratedMovies.results as IVideoContent[];
        this.nowPlayingMovies = res.nowPlaying.results as IVideoContent[];
        this.upcomingMovies = res.upcoming.results as IVideoContent[];
        this.popularMovies = res.popular.results as IVideoContent[];
        this.topRatedMovies = res.topRated.results as IVideoContent[];
        this.getMovieKey();
      })
  }

  getMovieKey() {
    this.movieService.getBannerVideo(this.movies[0].id)
    .subscribe(res=>{
      console.log(res);
    })
  }
}