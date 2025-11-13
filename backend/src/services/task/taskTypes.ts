export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

export enum TaskStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
  Canceled = 3,
}

export enum TaskRecurrence {
  None = 0,
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Custom = 4,
}

/**
 * @interface Task
 * @description Represents a task entity in the system.
 *
 * @property {number} idTask - Unique task identifier.
 * @property {number} idAccount - Associated account identifier.
 * @property {number} idUserCreator - Identifier of the user who created the task.
 * @property {number | null} idCategory - Identifier of the associated category.
 * @property {string} title - The title of the task.
 * @property {string} description - The detailed description of the task.
 * @property {Date | null} dueDate - The due date for the task.
 * @property {TaskPriority} priority - The priority level of the task.
 * @property {TaskStatus} status - The current status of the task.
 * @property {TaskRecurrence} recurrence - The recurrence pattern of the task.
 * @property {string | null} recurrenceConfigJson - JSON configuration for recurrence.
 * @property {Date} dateCreated - Creation timestamp.
 * @property {Date} dateModified - Last modification timestamp.
 * @property {boolean} deleted - Soft delete flag.
 */
export interface Task {
  idTask: number;
  idAccount: number;
  idUserCreator: number;
  idCategory: number | null;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
  recurrence: TaskRecurrence;
  recurrenceConfigJson: string | null;
  dateCreated: Date;
  dateModified: Date;
  deleted: boolean;
}

export interface TaskCreatePayload {
  idAccount: number;
  idUser: number;
  title?: string;
  description?: string;
  dueDate?: string | null;
  priority?: TaskPriority;
  idCategory?: number | null;
  recurrence?: TaskRecurrence;
  recurrenceConfigJson?: string | null;
}
