import { useState } from 'react';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';

interface TextBlock {
  id: string;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export function DocumentEditor() {
  const [blocks, setBlocks] = useState<TextBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const addTextBlock = () => {
    const newBlock: TextBlock = {
      id: `block-${Date.now()}`,
      content: 'New Text Block',
      position: { x: 100, y: 100 },
      size: { width: 200, height: 100 },
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlockContent = (id: string, content: string) => {
    setBlocks(
      blocks.map((block) =>
        block.id === id ? { ...block, content } : block
      )
    );
  };

  const updateBlockPosition = (id: string, x: number, y: number) => {
    setBlocks(
      blocks.map((block) =>
        block.id === id ? { ...block, position: { x, y } } : block
      )
    );
  };

  const handleSave = async () => {
    // TODO: Implement save functionality
    console.log('Saving document:', blocks);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Document Editor</h1>
          <div className="space-x-4">
            <button
              onClick={addTextBlock}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Text Block
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Document
            </button>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg min-h-[800px] relative p-8">
          {blocks.map((block) => (
            <Draggable
              key={block.id}
              position={block.position}
              onStop={(e, data) => updateBlockPosition(block.id, data.x, data.y)}
              bounds="parent"
            >
              <motion.div
                className={`absolute cursor-move p-4 rounded-md ${
                  selectedBlock === block.id
                    ? 'border-2 border-indigo-500'
                    : 'border border-gray-200'
                }`}
                style={{
                  width: block.size.width,
                  height: block.size.height,
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
                onClick={() => setSelectedBlock(block.id)}
                whileHover={{ scale: 1.01 }}
              >
                <textarea
                  className="w-full h-full resize-none border-none focus:outline-none"
                  value={block.content}
                  onChange={(e) => updateBlockContent(block.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="absolute bottom-0 right-0 p-2 cursor-se-resize">
                  ⋮
                </div>
              </motion.div>
            </Draggable>
          ))}
        </div>
      </div>
    </div>
  );
} 