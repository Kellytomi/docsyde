import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DocumentEditor } from '@/components/document/DocumentEditor';

export default function EditorPage() {
  return (
    <ProtectedRoute>
      <DocumentEditor />
    </ProtectedRoute>
  );
} 