import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  standalone: false,
  templateUrl: './add-task.html',
  styleUrl: './add-task.css',
})
export class AddTask {
  title = '';
  description = '';
  status = 'pending';
  message = '';

  constructor(private router: Router) {}

  async submitTask(): Promise<void> {
    const trimmedTitle = this.title.trim();

    if (!trimmedTitle) {
      this.message = 'Title is required.';
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: trimmedTitle,
          description: this.description,
          status: this.status
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Unable to create task.');
      }

      this.router.navigate(['/tasks']);
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Failed to add task.';
    }
  }
}
