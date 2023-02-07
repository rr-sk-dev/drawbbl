import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ChatComponent } from './components/chat/chat.component';
import { DrawComponent } from './components/draw/draw.component';
import { PlayersComponent } from './components/players/players.component';
import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';

@NgModule({
  declarations: [GameComponent, DrawComponent, PlayersComponent, ChatComponent],
  imports: [CommonModule, GameRoutingModule, SharedModule],
})
export class GameModule {}
