import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OpenaiApiService {
  API_KEY: string;
  API_URL: string;

  constructor() {
    this.API_KEY = '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';
    this.API_URL = 'https://api.openai.com/v1/chat/completions';
  }

  async getChat(userInput: string) {
    return await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${this.API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: userInput,
          },
        ],
      }),
    });
  }
}
