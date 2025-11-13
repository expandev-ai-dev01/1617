import { Outlet, Link } from 'react-router-dom';
import type { RootLayoutProps } from './types';

export const RootLayout = (props: RootLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              TODO List
            </Link>
            <nav>
              <Link
                to="/tasks/create"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Nova Tarefa
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
