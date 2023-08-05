import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OpenaiApiService {
  API_KEY: string;
  API_URL: string;
  previousMessages: Array<{ role: string; content: string }> = [];

  constructor() {
    this.API_KEY = '';
    this.API_URL = 'https://api.openai.com/v1/chat/completions';
  }

  async getChat(
    messages: Array<{
      title: string;
      message: { role: string; content: string };
    }>
  ) {
    //function content
    this.previousMessages = [];
    //getting the previous chat and adding it to previous images
    messages.map(
      (msg: { message: { role: string; content: string }; title: string }) => {
        this.previousMessages = [
          ...this.previousMessages,
          { role: msg.message.role, content: msg.message.content },
        ];
      }
    );

    return await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${this.API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: this.previousMessages,
      }),
    });
  }
}
