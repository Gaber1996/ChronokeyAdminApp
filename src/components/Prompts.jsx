import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, X, Save } from 'lucide-react';
import BASE_URL from './apis';

function PromptModal({ prompt, onClose, onSave, isEditing, loading }) {
  const [editedPrompt, setEditedPrompt] = useState(
    prompt || { name: '', promptDescription: '' }
  );

  const handleSubmit = () => {
    if (!editedPrompt.name.trim()) {
      alert('Prompt name is required');
      return;
    }
    onSave(editedPrompt);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              {isEditing ? 'Edit Prompt' : 'Add New Prompt'}
            </h3>
            <button onClick={onClose} className="btn btn-light !p-2">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Prompt Name */}
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Prompt Name</label>
              <input
                type="text"
                className="form-control"
                value={editedPrompt.name}
                onChange={(e) => setEditedPrompt({ ...editedPrompt, name: e.target.value })}
                placeholder="Enter prompt name"
              />
            </div>

            {/* Prompt Description */}
            <div className="form-group">
              <label className="form-label">Prompt Description</label>
              <textarea
                className="form-control min-h-[100px]"
                value={editedPrompt.promptDescription}
                onChange={(e) => setEditedPrompt({ ...editedPrompt, promptDescription: e.target.value })}
                placeholder="Enter prompt description"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
          <button onClick={onClose} className="btn btn-light">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary flex items-center gap-2"
          >
            <Save size={18} />
            {loading ? 'Submitting...' : isEditing ? 'Save Changes' : 'Add Prompt'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Prompts() {
  const [promptsList, setPromptsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);

  // Fetch prompts from API or mock data
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch(`${BASE_URL.BASE_URL}/business/v1/prompt`);
        if (!response.ok) {
          throw new Error('Failed to fetch prompts');
        }
        const data = await response.json();
        setPromptsList(data);
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  // Toggle expanded prompt
  const togglePrompt = (promptId) => {
    setExpandedPrompt(expandedPrompt === promptId ? null : promptId);
  };

  // Handle edit prompt
  const handleEdit = (prompt) => {
    setEditingPrompt(prompt);
  };

  // Handle delete prompt
  const handleDelete = (promptId) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      deletePrompt(promptId);
    }
  };

  const deletePrompt = async (promptId) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL.BASE_URL}/business/v1/prompt/${promptId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete prompt');
      }
      alert('Prompt Deleted Successfully');
      setPromptsList(promptsList.filter((prompt) => prompt.id !== promptId));
    } catch (error) {
      console.error('Error deleting prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle save for editing or adding prompt
  const handleSaveEdit = (editedPrompt) => {
    if (editingPrompt) {
      editPrompt(editedPrompt);
    } else {
      addPrompt(editedPrompt);
    }
    setEditingPrompt(null);
    setIsAddingPrompt(false);
  };

  const editPrompt = async (editedPrompt) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL.BASE_URL}/business/v1/prompt/${editedPrompt.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedPrompt),
      });
      if (!response.ok) {
        throw new Error('Failed to update prompt');
      }
      setPromptsList(promptsList.map((p) => (p.id === editedPrompt.id ? editedPrompt : p)));
      alert('Prompt updated successfully');
    } catch (error) {
      console.error('Error updating prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPrompt = async (newPrompt) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL.BASE_URL}/business/v1/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrompt),
      });
      if (!response.ok) {
        throw new Error('Failed to add prompt');
      }
      const addedPrompt = await response.json();
      setPromptsList([...promptsList, addedPrompt]);
      alert('Prompt added successfully');
    } catch (error) {
      console.error('Error adding prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Prompts</h2>
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => setIsAddingPrompt(true)}
        >
          <Plus size={20} />
          Add Prompt
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {promptsList.map((prompt) => (
            <div key={prompt.id} className={`card ${expandedPrompt === prompt.id ? 'border-primary' : ''}`}>
              <div
                className="card-header flex justify-between items-center"
                onClick={() => togglePrompt(prompt.id)}
                style={{ cursor: 'pointer' }}
              >
                <h5 className="text-lg font-medium mb-1">{prompt.name}</h5>
                <div className="flex items-center gap-2">
                  <button className="btn btn-light p-2 rounded-full" onClick={() => handleEdit(prompt)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn btn-light p-2 rounded-full" onClick={() => handleDelete(prompt.id)}>
                    <Trash2 size={16} />
                  </button>
                  <button className="btn btn-light p-2 rounded-full">
                    {expandedPrompt === prompt.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {expandedPrompt === prompt.id && (
                <div className="card-body">
                  <p className="text-gray">{prompt.promptDescription}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {(editingPrompt || isAddingPrompt) && (
        <PromptModal
          prompt={editingPrompt}
          onClose={() => {
            setEditingPrompt(null);
            setIsAddingPrompt(false);
          }}
          onSave={handleSaveEdit}
          isEditing={!!editingPrompt}
          loading={loading}
        />
      )}
    </div>
  );
}

export default Prompts;
