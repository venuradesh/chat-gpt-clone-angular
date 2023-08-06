import { Component, ViewChild } from '@angular/core';
import { ChatComponentComponent } from './Components/chat-component/chat-component.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'chat-gpt-clone';
  history: Array<string> = [];

  @ViewChild('chatComponent', { static: true })
  chatComponent: ChatComponentComponent;

  makeChatHistory = (value: any) => {
    console.log(value);
  };

  onNewChatClick = () => {
    this.chatComponent.onNewchatClick();
  };

  handleHistory = (event: string[]) => {
    this.history = [...event];
  };

  getTheChatHistory = (value: string, index: number) => {
    this.chatComponent.chatHistoryItemClicked(value, index);
  };
}
