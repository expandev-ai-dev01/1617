import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TaskPriority, TaskRecurrence } from '../../types';
import type { TaskFormProps } from './types';
import type { TaskFormData } from '../../types';

const taskFormSchema = z
  .object({
    title: z
      .string()
      .min(3, 'O título deve ter pelo menos 3 caracteres')
      .max(100, 'O título deve ter no máximo 100 caracteres'),
    description: z
      .string()
      .min(1, 'A descrição da tarefa é obrigatória')
      .max(500, 'A descrição deve ter no máximo 500 caracteres'),
    dueDate: z.string().optional(),
    dueTime: z.string().optional(),
    priority: z.nativeEnum(TaskPriority),
    idCategory: z.number().optional(),
    recurrence: z.nativeEnum(TaskRecurrence),
    recurrenceConfigJson: z.string().optional(),
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

export const TaskForm = (props: TaskFormProps) => {
  const { onSubmit, onCancel, isSubmitting = false, initialData } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      dueDate: initialData?.dueDate || '',
      dueTime: initialData?.dueTime || '',
      priority: initialData?.priority || TaskPriority.Medium,
      recurrence: initialData?.recurrence || TaskRecurrence.None,
      recurrenceConfigJson: initialData?.recurrenceConfigJson || '',
    },
  });

  const recurrence = watch('recurrence');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Título *
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição *
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Data de Vencimento
          </label>
          <input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
        </div>

        <div>
          <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 mb-1">
            Horário de Vencimento
          </label>
          <input
            id="dueTime"
            type="time"
            {...register('dueTime')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {errors.dueTime && <p className="mt-1 text-sm text-red-600">{errors.dueTime.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          Prioridade
        </label>
        <select
          id="priority"
          {...register('priority', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          <option value={TaskPriority.Low}>Baixa</option>
          <option value={TaskPriority.Medium}>Média</option>
          <option value={TaskPriority.High}>Alta</option>
        </select>
        {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>}
      </div>

      <div>
        <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700 mb-1">
          Recorrência
        </label>
        <select
          id="recurrence"
          {...register('recurrence', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          <option value={TaskRecurrence.None}>Nenhuma</option>
          <option value={TaskRecurrence.Daily}>Diária</option>
          <option value={TaskRecurrence.Weekly}>Semanal</option>
          <option value={TaskRecurrence.Monthly}>Mensal</option>
          <option value={TaskRecurrence.Custom}>Personalizada</option>
        </select>
        {errors.recurrence && (
          <p className="mt-1 text-sm text-red-600">{errors.recurrence.message}</p>
        )}
      </div>

      {recurrence !== TaskRecurrence.None && (
        <div>
          <label
            htmlFor="recurrenceConfigJson"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Configuração de Recorrência *
          </label>
          <textarea
            id="recurrenceConfigJson"
            rows={3}
            {...register('recurrenceConfigJson')}
            placeholder='{"interval": 1}'
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            disabled={isSubmitting}
          />
          {errors.recurrenceConfigJson && (
            <p className="mt-1 text-sm text-red-600">{errors.recurrenceConfigJson.message}</p>
          )}
        </div>
      )}

      <div className="flex gap-4 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Criando...' : 'Criar Tarefa'}
        </button>
      </div>
    </form>
  );
};
