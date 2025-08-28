import { RouterProvider } from 'react-router-dom';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { router } from '@/routes';

export default function App() {
  return (
    <NuqsAdapter>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </NuqsAdapter>
  );
}