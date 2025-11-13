export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

export enum TaskRecurrence {
  None = 0,
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Custom = 4,
}

export enum TaskStatus {
  Pending = 'pendente',
  InProgress = 'em_andamento',
  Completed = 'concluida',
  Cancelled = 'cancelada',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: string | null;
  priority: TaskPriority;
  idCategory?: number | null;
  recurrence: TaskRecurrence;
  recurrenceConfigJson?: string | null;
  status: TaskStatus;
  userId: string;
  createdAt: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  dueDate?: string | null;
  priority?: TaskPriority;
  idCategory?: number | null;
  recurrence?: TaskRecurrence;
  recurrenceConfigJson?: string | null;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate?: string;
  dueTime?: string;
  priority: TaskPriority;
  idCategory?: number;
  recurrence: TaskRecurrence;
  recurrenceConfigJson?: string;
}
