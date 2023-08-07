import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OpenaiApiService {
  API_KEY: string;
  API_URL: string;
  API_KEY_IMAGES: string;
  API_URL_IMAGES: string;
  previousMessages: Array<{ role: string; content: string }> = [];

  constructor() {
    this.API_KEY = '';
    this.API_KEY_IMAGES = '';
    this.API_URL_IMAGES = 'https://api.openai.com/v1/images/generations';
    this.API_URL = 'https://api.openai.com/v1/chat/completions';
  }

  async getImages(prompt: string) {
    return await fetch(this.API_URL_IMAGES, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.API_KEY_IMAGES}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 4,
        size: '256x256',
      }),
    });
  }

  async getChat(
    messages: Array<{
      type: string;
      title: string;
      message: { role: string; content: string };
    }>
  ) {
    //function content
    this.previousMessages = [];
    //getting the previous chat and adding it to previous images
    messages.map(
      (msg: {
        message: { role: string; content: string };
        title: string;
        type: string;
      }) => {
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
