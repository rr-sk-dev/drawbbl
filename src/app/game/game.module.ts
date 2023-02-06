import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { DrawComponent } from './components/draw/draw.component';
import { PlayersComponent } from './components/players/players.component';
import { ChatComponent } from './components/chat/chat.component';

@NgModule({
  declarations: [GameComponent, DrawComponent, PlayersComponent, ChatComponent],
  imports: [CommonModule, GameRoutingModule],
})
export class GameModule {}
