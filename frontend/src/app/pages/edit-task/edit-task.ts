import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Task {
  _id?: string;
  title?: string;
  description?: string;
  status?: string;
}

@Component({
  selector: 'app-edit-task',
  standalone: false,
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.css',
})
export class EditTask implements OnInit {
  taskId = '';
  title = '';
  description = '';
  status = 'pending';
  message = '';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id') || '';
    this.loadTask();
  }

  async loadTask(): Promise<void> {
    if (!this.taskId) {
      this.message = 'Invalid task ID.';
      this.isLoading = false;
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/tasks');

      if (!response.ok) {
        throw new Error('Unable to fetch task.');
      }

      const tasks: Task[] = await response.json();
      const task = tasks.find((item) => item._id === this.taskId);

      if (!task) {
        this.message = 'Task not found.';
        return;
      }

      this.title = task.title || '';
      this.description = task.description || '';
      this.status = task.status || 'pending';
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Failed to load task.';
    } finally {
      this.isLoading = false;
    }
  }

  async submitTask(): Promise<void> {
    if (!this.title.trim()) {
      this.message = 'Title is required.';
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${this.taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: this.title.trim(),
          description: this.description,
          status: this.status
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update task.');
      }

      this.router.navigate(['/tasks']);
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Failed to update task.';
    }
  }
}