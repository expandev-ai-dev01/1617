import { dbRequest, ExpectedReturn } from '@/utils/database';
import { Task, TaskCreatePayload } from './taskTypes';

/**
 * @summary
 * Creates a new task in the database.
 *
 * @function taskCreate
 * @module task
 *
 * @param {TaskCreatePayload} params - The payload for creating a new task.
 *
 * @returns {Promise<Task>} The newly created task entity.
 */
export async function taskCreate(params: TaskCreatePayload): Promise<Task> {
  const result = await dbRequest(
    '[functional].[spTaskCreate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      title: params.title,
      description: params.description,
      dueDate: params.dueDate,
      priority: params.priority,
      idCategory: params.idCategory,
      recurrence: params.recurrence,
      recurrenceConfigJson: params.recurrenceConfigJson,
    },
    ExpectedReturn.Single
  );

  return result;
}
