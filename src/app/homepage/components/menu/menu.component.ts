import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  username: string = '';

  constructor(private router: Router) {}

  onPlayClick() {
    alert('game starting');
    this.router.navigateByUrl(`/${this.username}`);
  }

  onCreatePrivateRoomClick() {
    this.router.navigateByUrl(`/${this.username}`);
  }
}
