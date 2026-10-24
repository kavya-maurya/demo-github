
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Task {
  _id?: string;
  title: string;
  description?: string;
  status?: string;
}

@Component({
  selector: 'app-tasks',
  standalone: false,
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  tasks: Task[] = [];
  message = '';
  loading = false;

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  async loadTasks(): Promise<void> {
    this.loading = true;
    this.message = '';
    this.cdRef.detectChanges();

    try {
      const response = await fetch('http://localhost:3000/api/tasks');

      if (!response.ok) {
        throw new Error('Unable to load tasks. Please make sure the backend is running.');
      }

      const data = await response.json();
      this.tasks = Array.isArray(data) ? data : [];
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Failed to load tasks.';
      this.tasks = [];
    } finally {
      this.loading = false;
      this.cdRef.detectChanges();
    }
  }

  goToAddTask(): void {
    this.router.navigate(['/tasks/add']);
  }

  async deleteTask(taskId?: string): Promise<void> {
    if (!taskId) {
      return;
    }

    const confirmed = window.confirm('Delete this task?');
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Unable to delete task.');
      }

      this.tasks = this.tasks.filter((task) => task._id !== taskId);
      this.message = 'Task deleted successfully.';
      this.cdRef.detectChanges();
    } catch (error) {
      this.message = error instanceof Error ? error.message : 'Failed to delete task.';
      this.cdRef.detectChanges();
    }
  }
}

