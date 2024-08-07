import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { catchError, retry } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tennis';
  score(playerId: number) {
    this.game = this.http.post<Game>("http://localhost:8080/score", {player: playerId == 1 ? "Player 1" : "Player 2"}, {withCredentials: true})
  }

  constructor(http: HttpClient) {
    this.http = http;
    this.game = http.get<Game>("http://localhost:8080/score", {withCredentials: true})
    .pipe(
      catchError((err, caught) => {this.error = JSON.stringify(err); return caught}),
      retry({count: 3, delay: 500})
    );
  }
  game;
  http;
  error: string|undefined;
}
interface Game {
  game: string,
  set: string,
  match: string,
  tiebreaker: string|null
}
