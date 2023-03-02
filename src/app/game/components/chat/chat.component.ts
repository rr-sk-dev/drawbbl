import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  newMessage = '';
  messageList: string[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getMessages().subscribe((message) => {
      this.messageList.push(message);
    });
  }

  sendMessage() {
    this.chatService.sendMessage(this.newMessage);

    this.newMessage = '';
  }
}
