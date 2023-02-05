import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from './game.model';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  constructor(private http: HttpClient) {}

  create(username: string) {
    console.log('Creating a game for user', username);

    return this.http.post<Game>('http://localhost:3000/games', { username });
  }
}
