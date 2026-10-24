import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Tasks } from './pages/tasks/tasks';
import { AddTask } from './pages/add-task/add-task';
import { EditTask } from './pages/edit-task/edit-task';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'tasks', component: Tasks },
  { path: 'tasks/add', component: AddTask },
  { path: 'tasks/edit/:id', component: EditTask },
  { path: '**', redirectTo: '' }
];

@NgModule({ 
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
