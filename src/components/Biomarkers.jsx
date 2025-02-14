import React, { useState , useEffect } from 'react';
import { Plus, Search, Filter, ChevronDown, ChevronUp, Edit2, Trash2, X, Save, PlusCircle, MinusCircle } from 'lucide-react';
import BASE_URL from './apis';



function BiomarkerModal({ biomarker, onClose, onSave, isEditing }) {
  const [editedBiomarker, setEditedBiomarker] = useState(
    biomarker || {
      name: '',
      referenceValues: {}
    }
  );

  const handleRangeChange = (field, value) => {
    setEditedBiomarker({
        ...editedBiomarker,
        referenceValues: {
            ...editedBiomarker.referenceValues,
            [field]: value
        }
    });
};

  const addRange = () => {
    setEditedBiomarker({
      ...editedBiomarker,
      referenceValues: [...editedBiomarker.referenceValues, {
        low: '',
        normal: '',
        high: ''
      }]
    });
  };

  const removeRange = (index) => {
    const newRanges = editedBiomarker.referenceValues.filter((_, i) => i !== index);
    setEditedBiomarker({ ...editedBiomarker, referenceValues: newRanges });
  };

  const handleSubmit = () => {
    if (!editedBiomarker.name.trim()) {
      alert('Name and category are required');
      return;
    }

    const invalidRanges =  !editedBiomarker.referenceValues.low || 
    !editedBiomarker.referenceValues.normal || 
    !editedBiomarker.referenceValues.high;
    if (invalidRanges) {
      alert('All range fields must be filled');
      return;
    }

    onSave(editedBiomarker);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              {isEditing ? 'Edit Biomarker' : 'Add New Biomarker'}
            </h3>
            <button onClick={onClose} className="btn btn-light !p-2">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={editedBiomarker.name}
                onChange={(e) => setEditedBiomarker({ ...editedBiomarker, name: e.target.value })}
                placeholder="Enter biomarker name"
              />
            </div>
            {/* <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                value={editedBiomarker.category}
                onChange={(e) => setEditedBiomarker({ ...editedBiomarker, category: e.target.value })}
                placeholder="Enter category"
              />
            </div> */}
            {/* <div className="form-group">
              <label className="form-label">Weight</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                className="form-control"
                value={editedBiomarker.weight}
                onChange={(e) => setEditedBiomarker({ ...editedBiomarker, weight: parseFloat(e.target.value) })}
              />
            </div> */}
          </div>

          {/* Ranges */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">Reference Ranges</h4>
              {/* <button 
                onClick={addRange}
                className="btn btn-light flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Add Range
              </button> */}
            </div>

            <div className="space-y-4">
              {/* {editedBiomarker.ranges.map((range, index) => ( */}
                <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h6 className="font-medium">Range</h6>
                    {/* <button 
                      onClick={() => removeRange(index)}
                      className="btn btn-light !p-2"
                    >
                      <MinusCircle size={18} className="text-red-500" />
                    </button> */}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* <div>
                      <label className="form-label">Gender</label>
                      <select
                        className="form-control"
                        value={range.gender}
                        onChange={(e) => handleRangeChange(index, 'gender', e.target.value)}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div> */}
                    {/* <div>
                      <label className="form-label">Age Range</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., 18-30"
                        value={range.ageRange}
                        onChange={(e) => handleRangeChange(index, 'ageRange', e.target.value)}
                      />
                    </div> */}
                    <div>
                      <label className="form-label">Low</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., <70 mg/dL"
                        value={editedBiomarker.referenceValues.low}
                        onChange={(e) => handleRangeChange('low', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Normal</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., 70-99 mg/dL"
                        value={editedBiomarker.referenceValues.normal}
                        onChange={(e) => handleRangeChange('normal', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">High</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., >99 mg/dL"
                        value={editedBiomarker.referenceValues.high}
                        onChange={(e) => handleRangeChange('high', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              {/* ))} */}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
          <button onClick={onClose} className="btn btn-light">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="btn btn-primary flex items-center gap-2"
          >
            <Save size={18} />
            {isEditing ? 'Save Changes' : 'Create Biomarker'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Biomarkers() {
  const [biomarkersList, setBiomarkersList] = useState([]);
  const [expandedBiomarker, setExpandedBiomarker] = useState(null);
  const [editingBiomarker, setEditingBiomarker] = useState(null);
  const [isAddingBiomarker, setIsAddingBiomarker] = useState(false);
    const [loading, setLoading] = useState(true);
  

   useEffect(() => {
      fetch(`${BASE_URL.BASE_URL}/business/v1/analysis/with-references`)
        .then(response => response.json())
        .then(data => {
          console.log("data",data);
          
          setBiomarkersList(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching biomarkers:', error);
          setLoading(false);
        });
    }, []);

  const toggleBiomarker = (biomarkerId) => {
    setExpandedBiomarker(expandedBiomarker === biomarkerId ? null : biomarkerId);
  };

  const handleEdit = (biomarker, e) => {
    e.stopPropagation();
    setEditingBiomarker(biomarker);
  };

  const handleDelete = (biomarkerId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this biomarker?')) {
      // setBiomarkersList(biomarkersList.filter(b => b.id !== biomarkerId));
      deleteMarker(biomarkerId)
    }
  };

  const handleSaveEdit = (editedBiomarker) => {
    console.log("edited" ,editedBiomarker);
    const { categories, ...updatedBiomarker } = editedBiomarker;


    console.log(updatedBiomarker);

    updateBiomarker(updatedBiomarker)
    
    setEditingBiomarker(null);
  };
  const updateBiomarker = async (updatedBiomarker) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL.BASE_URL}/business/v1/update-medical-analysis`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBiomarker),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      window.location.reload();

      alert('Data submitted Successfully')
      console.log("Category added successfully:", data);
      return data;
    } catch (error) {
      console.error("Error adding category:", error);
    }finally{
      setLoading(false)
    }
  };

  const handleAddBiomarker = (newBiomarker) => {
    const updatedBiomarker = {
      ...newBiomarker,
      referenceValues: [newBiomarker.referenceValues] // Wrap referenceValues in an array
  };
    // setBiomarkersList([...biomarkersList, newBiomarker]);
    console.log("new", updatedBiomarker);
    addBiomarkerWithRanges(updatedBiomarker);

    
    setIsAddingBiomarker(false);
  };
  const addBiomarkerWithRanges = async (editedBiomarker) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL.BASE_URL}/business/v1/insert-analysis-withreferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedBiomarker),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      alert('Data submitted Successfully')
      window.location.reload();
      console.log("Category added successfully:", data);
      return data;
    } catch (error) {
      console.error("Error adding category:", error);
    }finally{
      setLoading(false)
    }
  };

  const deleteMarker = async (markerId) => {
    setLoading(true);
    try {
      const response =  await fetch(`${BASE_URL.BASE_URL}/business/v1/delete-medical-analysis/${markerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // const data = await response.json();
      window.location.reload();
      alert('Category Deleted Successfully')
      
      return
    } catch (error) {
      console.error("Error deleting category:", error);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="content-area">
      <div className="flex justify-between items-center mb-4 flex-col-mobile gap-4">
        <h2 className="text-lg font-medium">Biomarkers</h2>
        <div className="flex items-center gap-4 w-full-mobile">
          <div className="form-group flex-1">
            <div className="flex items-center">
              <Search className="text-gray" size={20} style={{ marginLeft: '10px', position: 'absolute' }} />
              <input
                type="text"
                placeholder="Search biomarkers..."
                className="form-control"
                style={{ paddingLeft: '35px' }}
              />
            </div>
          </div>
          <button className="btn btn-light">
            <Filter size={20} />
          </button>
          <button 
            className="btn btn-primary flex items-center gap-2"
            onClick={() => setIsAddingBiomarker(true)}
          >
            <Plus size={20} />
            Add Biomarker
          </button>
        </div>
      </div>

      {loading ? (
          <div className="flex justify-center items-center h-40">
          <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>{/* You can replace this with any loader component */}
        </div>
      ) : (   <div className="grid gap-4">
        {biomarkersList.map((biomarker) => (
          <div key={biomarker.id} className="card">
            <div 
              className="card-header flex justify-between items-center"
              onClick={() => toggleBiomarker(biomarker.id)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <h5 className="text-lg font-medium">{biomarker.name}</h5>
                {biomarker.categories.map((category, index) => (
      <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
        <small className="text-gray-700">
          Category: {category?.name}
        </small>
        <span className="badge badge-primary">
          Weight: {category?.wgt}
        </span>
      </div>
    ))}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="btn btn-light p-2 rounded-full"
                  onClick={(e) => handleEdit(biomarker, e)}
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  className="btn btn-light p-2 rounded-full"
                  onClick={(e) => handleDelete(biomarker.id, e)}
                >
                  <Trash2 size={16} />
                </button>
                <button className="btn btn-light">
                  {expandedBiomarker === biomarker.id ? (
                    <ChevronUp size={20} className="text-gray" />
                  ) : (
                    <ChevronDown size={20} className="text-gray" />
                  )}
                </button>
              </div>
            </div>

            {expandedBiomarker === biomarker.id && (
              <div className="card-body">
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                       
                        <th>Low</th>
                        <th>Normal</th>
                        <th>High</th>
                      </tr>
                    </thead>
                    <tbody>
                    <td>
                            <span className="badge badge-danger">
                              {biomarker.referenceValues.low}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-success">
                              {biomarker.referenceValues.normal}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-warning">
                              {biomarker.referenceValues.high}
                            </span>
                          </td>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      )}

      {(editingBiomarker || isAddingBiomarker) && (
        <BiomarkerModal
          biomarker={editingBiomarker}
          onClose={() => {
            setEditingBiomarker(null);
            setIsAddingBiomarker(false);
          }}
          onSave={editingBiomarker ? handleSaveEdit : handleAddBiomarker}
          isEditing={!!editingBiomarker}
        />
      )}
    </div>
  );
}

export default Biomarkers;