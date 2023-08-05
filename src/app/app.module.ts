import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponentComponent } from './Components/chat-component/chat-component.component';

@NgModule({
  declarations: [AppComponent, ChatComponentComponent],
  imports: [BrowserModule, AppRoutingModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
