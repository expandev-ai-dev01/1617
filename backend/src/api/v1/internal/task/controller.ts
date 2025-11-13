import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { taskCreate, TaskPriority, TaskRecurrence } from '@/services/task';
import { zNullableFK } from '@/utils/zodValidation';

const securable = 'TASK';

const bodySchema = z
  .object({
    title: z
      .string()
      .min(3, 'O título deve ter pelo menos 3 caracteres')
      .max(100, 'O título deve ter no máximo 100 caracteres'),
    description: z
      .string()
      .min(1, 'A descrição da tarefa é obrigatória')
      .max(500, 'A descrição deve ter no máximo 500 caracteres'),
    dueDate: z
      .string()
      .datetime({ message: 'A data de vencimento deve ser uma data e hora válida' })
      .optional()
      .nullable(),
    priority: z.nativeEnum(TaskPriority).default(TaskPriority.Medium),
    idCategory: zNullableFK,
    recurrence: z.nativeEnum(TaskRecurrence).default(TaskRecurrence.None),
    recurrenceConfigJson: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.recurrence !== TaskRecurrence.None && !data.recurrenceConfigJson) {
        return false;
      }
      return true;
    },
    {
      message: 'A configuração de recorrência é obrigatória para tarefas recorrentes',
      path: ['recurrenceConfigJson'],
    }
  );

type TaskCreateRequest = z.infer<typeof bodySchema>;

/**
 * @api {post} /internal/task Create Task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task.
 *
 * @apiParam {String} title Task title.
 * @apiParam {String} description Task description.
 * @apiParam {String} [dueDate] Due date in ISO 8601 format.
 * @apiParam {Number} [priority] Priority (0=Low, 1=Medium, 2=High). Default: 1.
 * @apiParam {Number} [idCategory] ID of the category.
 * @apiParam {Number} [recurrence] Recurrence pattern (0=None, 1=Daily, 2=Weekly, 3=Monthly, 4=Custom). Default: 0.
 * @apiParam {String} [recurrenceConfigJson] JSON string for recurrence configuration.
 *
 * @apiSuccess {Object} data The created task object.
 *
 * @apiError {String} ValidationError Invalid parameters provided.
 * @apiError {String} UnauthorizedError User lacks permission.
 * @apiError {String} ServerError Internal server error.
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const [validated, error] = await operation.create(req, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskCreate({
      idAccount: validated.credential.idAccount,
      idUser: validated.credential.idUser,
      title: validated.params.title,
      description: validated.params.description,
      dueDate: validated.params.dueDate,
      priority: validated.params.priority,
      idCategory: validated.params.idCategory,
      recurrence: validated.params.recurrence,
      recurrenceConfigJson: validated.params.recurrenceConfigJson,
    });
    res.status(201).json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
