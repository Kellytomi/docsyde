import { useState } from 'react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'John Doe',
    content: 'Please review the terms in section 2.',
    timestamp: '2024-03-20T10:00:00Z',
  },
  {
    id: '2',
    author: 'Jane Smith',
    content: 'Everything looks good to me.',
    timestamp: '2024-03-20T11:30:00Z',
  },
];

export function DocumentView() {
  const [signature, setSignature] = useState('');
  const [comments] = useState<Comment[]>(MOCK_COMMENTS);

  const handleSign = () => {
    if (signature.trim()) {
      console.log('Document signed:', signature);
      // TODO: Implement actual signing functionality
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Document Content */}
          <div className="p-8 border-b">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Sample Document
            </h1>
            <div className="prose max-w-none">
              <p>
                This is a sample document content. In the actual implementation,
                this would show the saved document layout and content.
              </p>
            </div>
          </div>

          {/* Signature Section */}
          <div className="p-8 border-b bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sign Document
            </h2>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Type your full name to sign"
                className="flex-1 px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleSign}
                disabled={!signature.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign Document
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Comments
            </h2>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {comment.author}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 