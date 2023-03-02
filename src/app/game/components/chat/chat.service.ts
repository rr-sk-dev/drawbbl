import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  message$: BehaviorSubject<string> = new BehaviorSubject('');

  // TODO: Create a configuration file
  private SOCKET_URL = 'ws://localhost:3001';
  private socket = io(this.SOCKET_URL);

  sendMessage(message: string) {
    this.socket.emit('event', message);
  }

  getMessages() {
    this.socket.on('message', (message) => {
      this.message$.next(message);
    });

    return this.message$.asObservable();
  }
}
