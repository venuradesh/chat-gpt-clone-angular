import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
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
  loading: boolean = false;
  history: Array<string> = [];
  previousChats = [];
  images = [];
  generateImages: boolean = false;
  previousImages = [];
  error: boolean = false;

  @ViewChild('InputElement') inputElement: ElementRef;

  @Output() messagesHistory: EventEmitter<string[]> = new EventEmitter<
    string[]
  >();

  constructor(private openAIApiService: OpenaiApiService) {}

  ngOnInit(): void {
    this.messagesHistory.emit(this.history);
    if (this.previousChats.length > 0) {
      this.getTheGPTChat();
    }
  }

  getTheGPTChat = async () => {
    if (this.chatInput) {
      try {
        this.error = false;
        if (!this.generateImages) {
          //for text input without images
          const response = await this.openAIApiService.getChat(this.messages);
          const data = await response.json();
          this.messages = [
            ...this.messages,
            {
              type: 'text',
              title: this.firstMessage,
              message: data.choices[0].message,
            },
          ];
          if (data) this.loading = false;
        } else {
          //accepting the images
          //putting the images into images array to view the images
          //putting the images into previous images array to continue the chat
          const response = await this.openAIApiService.getImages(
            this.chatInput
          );
          const images = await response.json();
          this.images = [...images.data];

          this.previousImages = [
            ...this.previousImages,
            {
              title: this.firstMessage,
              content: this.images,
              type: 'image',
              role: 'assistant',
            },
          ];

          this.messages = [
            ...this.messages,
            {
              title: this.firstMessage,
              content: this.images,
              type: 'image',
              role: 'assistant',
            },
          ];
          if (images) {
            this.loading = false;
          }
        }
      } catch (e) {
        this.loading = false;
        this.error = true;
        console.error(e);
      }
    } else {
      console.error('First Enter a query to generate the chat');
    }
  };

  insertTheMessage = (event: any) => {
    this.chatInput = event.target.value;
    if (this.messages.length === 0) {
      this.firstMessage = event.target.value;
      this.history = [...this.history, event.target.value];
      this.messagesHistory.emit(this.history);
    }
  };

  onEnterPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      this.insertTheMessage({
        target: { value: this.inputElement.nativeElement.value },
      });
      this.getTheMessageFromUser();
    }
  };

  getTheMessageFromUser = () => {
    if (this.chatInput) {
      this.loading = true;

      if (!this.generateImages) {
        this.messages = [
          ...this.messages,
          {
            type: 'text',
            title: this.firstMessage,
            message: {
              role: 'user',
              content: this.chatInput,
            },
          },
        ];
      } else {
        this.messages = [
          ...this.messages,
          {
            title: this.firstMessage,
            content: this.chatInput,
            role: 'user',
            type: 'image',
          },
        ];
      }

      this.getTheGPTChat();
      this.inputElement.nativeElement.value = '';
    }
  };

  onNewchatClick = () => {
    this.previousChats = [...this.previousChats, this.messages];
    this.messages = [];
    this.firstMessage = '';
    this.chatInput = '';
    this.inputElement.nativeElement.value = '';
  };

  genImages = () => {
    this.generateImages = !this.generateImages;
    this.onNewchatClick();
  };

  //triggers when history item is clicked and
  //triggers by the parent component (app-root)
  chatHistoryItemClicked = (itemClicked: string, index: number) => {
    /*
      First Enter the current messages into the previous messages 
      otherwise the current messages will be lost.
      Then find the item that match the title with the itemClicked and 
      add that item to the messages and remove that item from previous chat.
      then set the firstMessage as the itemClicked
    */
    this.previousChats = [...this.previousChats, this.messages];
    let flag: boolean = false;
    let removeItem: number;

    this.previousChats.map((chat, index) => {
      chat.map((msg: any) => {
        if (msg.title === itemClicked) {
          if (msg.type === 'image') {
            this.generateImages = true;
          } else {
            this.generateImages = false;
          }
          this.messages = [...chat];
          this.firstMessage = itemClicked;
          flag = true;
          //used for removing the chat from the previous chat
          removeItem = index;
        }
      });
    });

    //removing the selected chat from the previous chats
    //becuase at the begining i'm adding the current chat to the previous chat
    if (flag) {
      this.previousChats = this.previousChats.filter(
        (item, i) => i !== removeItem
      );
    }
  };
}
