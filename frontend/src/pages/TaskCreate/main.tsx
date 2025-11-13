import { useNavigate } from 'react-router-dom';
import { TaskForm } from '@/domain/task/components/TaskForm';
import { useTaskCreate } from '@/domain/task/hooks/useTaskCreate';
import type { TaskFormData, CreateTaskDto } from '@/domain/task/types';
import type { TaskCreatePageProps } from './types';

export const TaskCreatePage = (props: TaskCreatePageProps) => {
  const navigate = useNavigate();
  const { createTask, isCreating } = useTaskCreate({
    onSuccess: () => {
      navigate('/');
    },
    onError: (error: Error) => {
      console.error('Failed to create task:', error);
    },
  });

  const handleSubmit = async (data: TaskFormData) => {
    const createDto: CreateTaskDto = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      recurrence: data.recurrence,
    };

    if (data.dueDate) {
      let dueDateString = data.dueDate;
      if (data.dueTime) {
        dueDateString = `${data.dueDate}T${data.dueTime}:00`;
      } else {
        dueDateString = `${data.dueDate}T00:00:00`;
      }
      createDto.dueDate = new Date(dueDateString).toISOString();
    }

    if (data.idCategory) {
      createDto.idCategory = data.idCategory;
    }

    if (data.recurrenceConfigJson) {
      createDto.recurrenceConfigJson = data.recurrenceConfigJson;
    }

    await createTask(createDto);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Criar Nova Tarefa</h2>
        <p className="text-gray-600 mt-2">Preencha os campos abaixo para criar uma nova tarefa</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <TaskForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isCreating} />
      </div>
    </div>
  );
};

export default TaskCreatePage;
