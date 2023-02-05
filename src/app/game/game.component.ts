import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Game } from './game.model';
import { GamesService } from './games.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesService
  ) {}

  game!: Game;

  gameSubscription$!: Subscription;

  ngOnInit() {
    this.gameSubscription$ = this.gamesService
      .create(this.route.snapshot.paramMap.get('id') as string)
      .subscribe((data) => {
        this.game = data;
      });
  }

  ngOnDestroy() {
    this.gameSubscription$.unsubscribe();
  }
}
