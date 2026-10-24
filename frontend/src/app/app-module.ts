import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Tasks } from './pages/tasks/tasks';
import { Home } from './pages/home/home';

import { AddTask } from './pages/add-task/add-task';
import { EditTask } from './pages/edit-task/edit-task';

@NgModule({
  declarations: [App, Tasks, AddTask, EditTask, Home],
  imports: [BrowserModule, AppRoutingModule,FormsModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
