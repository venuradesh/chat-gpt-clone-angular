import { Component, ViewChild } from '@angular/core';
import { ChatComponentComponent } from './Components/chat-component/chat-component.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'chat-gpt-clone';

  @ViewChild('chatComponent', { static: true })
  chatComponent: ChatComponentComponent;

  makeChatHistory = (value: any) => {
    console.log(value);
  };

  onNewChatClick = () => {
    this.chatComponent.onNewchatClick();
  };
}
