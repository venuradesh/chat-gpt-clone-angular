import { Component, OnInit } from '@angular/core';
import { OpenaiApiService } from 'src/app/Services/openai-api.service';

@Component({
  selector: 'app-chat-component',
  templateUrl: './chat-component.component.html',
  styleUrls: ['./chat-component.component.css'],
})
export class ChatComponentComponent implements OnInit {
  messages = [];
  firstMessage: string = '';
  chatInput: string = '';

  constructor(private openAIApiService: OpenaiApiService) {}

  ngOnInit(): void {
    this.getTheGPTChat();
  }

  getTheGPTChat = async () => {
    if (this.chatInput) {
      try {
        const response = await this.openAIApiService.getChat(this.chatInput);
        const data = await response.json();
        this.messages = [
          ...this.messages,
          {
            title: this.firstMessage,
            message: data.choices[0].message,
          },
        ];
        console.log(data);
      } catch (e) {
        console.error(e);
      }
    } else {
      console.error('First Enter a query to generate the chat');
    }
  };

  insertTheMessage = (event) => {
    this.chatInput = event.target.value;
  };

  getTheMessageFromUser = () => {
    if (this.chatInput) {
      this.messages = [
        ...this.messages,
        {
          title: this.firstMessage,
          message: {
            role: 'user',
            content: this.chatInput,
          },
        },
      ];

      this.getTheGPTChat();
    }
  };
}
