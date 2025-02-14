import React, { useState ,useEffect } from 'react';
import { Heart, Brain, Activity, Plus, ChevronDown, ChevronUp, Edit2, Trash2, X, Save, PlusCircle, MinusCircle } from 'lucide-react';
import BASE_URL from './apis';


function CategoryModal({ category, onClose, onSave, isEditing , loading , bioMarkers }) {
  const [editedCategory, setEditedCategory] = useState(
    category || {
      name: '',
      description: '',
      howToCalculate: '',
      medicalAnalyses: []
    }
  );

 

  const handleBiomarkerChange = (index, field, value) => {
    // const newBiomarkers = [...editedCategory.medicalAnalyses];
    // newBiomarkers[index] = {
    //   ...newBiomarkers[index],
    //   [field]: field === 'weight' ? parseFloat(value) : value
    // };
    // setEditedCategory({ ...editedCategory, medicalAnalyses: newBiomarkers });
    const newBiomarkers = [...editedCategory.medicalAnalyses];

  if (field === "name") {
    // Find the selected biomarker's default weight
    const selectedBiomarker = bioMarkers.find((b) => b.name === value);
    newBiomarkers[index] = {
      name: value,
      weight: selectedBiomarker ? selectedBiomarker.weight : 0.5, // Default weight
    };
  } else {
    newBiomarkers[index] = {
      ...newBiomarkers[index],
      [field]: field === "weight" ? parseFloat(value) : value,
    };
  }

  setEditedCategory({ ...editedCategory, medicalAnalyses: newBiomarkers });

  };

  const addBiomarker = () => {
    setEditedCategory({
      ...editedCategory,
      medicalAnalyses: [...editedCategory.medicalAnalyses, { name: '', weight: 0.5 }]
    });
  };

  const removeBiomarker = (index) => {
    const newBiomarkers = editedCategory.medicalAnalyses.filter((_, i) => i !== index);
    setEditedCategory({ ...editedCategory, medicalAnalyses: newBiomarkers });
  };

  const handleSubmit = () => {
    if (!editedCategory.name.trim()) {
      alert('Category name is required');
      return;
    }

    const invalidBiomarkers = editedCategory.medicalAnalyses.some(b => !b.name.trim());
    if (invalidBiomarkers) {
      alert('All biomarkers must have a name');
      return;
    }

    onSave(editedCategory);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              {isEditing ? 'Edit Category' : 'Add New Category'}
            </h3>
            <button onClick={onClose} className="btn btn-light !p-2">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Category Name</label>
              <input
                type="text"
                className="form-control"
                value={editedCategory.name}
                onChange={(e) => setEditedCategory({ ...editedCategory, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control min-h-[100px]"
                value={editedCategory.description}
                onChange={(e) => setEditedCategory({ ...editedCategory, description: e.target.value })}
                placeholder="Enter category description"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tips & Tricks</label>
              <textarea
                className="form-control"
                value={editedCategory.howToCalculate}
                onChange={(e) => setEditedCategory({ ...editedCategory, howToCalculate: e.target.value })}
                placeholder="Enter tips and tricks"
              />
            </div>
          </div>

          {/* Biomarkers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">Biomarkers</h4>
              <button 
                onClick={addBiomarker}
                className="btn btn-light flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Add Biomarker
              </button>
            </div>

            <div className="space-y-4">
              {editedCategory.medicalAnalyses.map((medicalAnalyses, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    {/* <input
                      type="text"
                      placeholder="Biomarker name"
                      className="form-control"
                      value={medicalAnalyses.name}
                      onChange={(e) => handleBiomarkerChange(index, 'name', e.target.value)}
                    /> */}
                    <select
            className="form-control"
            value={medicalAnalyses.name}
            onChange={(e) => handleBiomarkerChange(index, "name", e.target.value)}
          >
            <option value="" disabled>Select a Biomarker</option>
            {bioMarkers.map((biomarker) => (
              <option key={biomarker.name} value={biomarker.name}>
                {biomarker.name}
              </option>
            ))}
          </select>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      className="form-control"
                      value={medicalAnalyses.weight}
                      onChange={(e) => handleBiomarkerChange(index, 'weight', e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => removeBiomarker(index)}
                    className="btn btn-light !p-2"
                  >
                    <MinusCircle size={18} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
          <button onClick={onClose} className="btn btn-light">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled = {loading}
            className="btn btn-primary flex items-center gap-2"
          >
            <Save size={18} />
            {loading ? "Submitting..." : isEditing ? "Save Changes" : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Categories() {
  // const [categoriesList, setCategoriesList] = useState(initialCategories);
  // const [expandedCategory, setExpandedCategory] = useState(null);
  // const [editingCategory, setEditingCategory] = useState(null);
  // const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedCategories, setFetchedCategories] = useState(new Set()); // Track fetched categories
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [bioMarkers , setBioMarkers] = useState([]);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await fetch('http://127.0.0.1:8080/business/v1/categories'); 
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch categories');
  //       }
  //       const data = await response.json();
  //       console.log("sssss",data);
        
  //       setCategoriesList(data);
  //     } catch (error) {
  //       setError(error.message);
  //     } finally {
  //       // setLoading(false);
  //     }
  //   };

  //   fetchCategories();
  // }, []);

  // useEffect(() => {
  //   if (categoriesList.length === 0) return;

  //   const fetchBiomarkersForCategory = async (category) => {
  //     try {
  //       const response = await fetch(`http://127.0.0.1:8080/business/v1/analysis/category-name?categoryName=${category.name}`); // API fetches biomarkers for each category
  //       if (!response.ok) {
  //         throw new Error(`Failed to fetch biomarkers for ${category.name}`);
  //       }
  //       const biomarkersData = await response.json();
  //       console.log(`Fetched Biomarkers for ${category.name}:`, biomarkersData);

  //       // Update only the category that was fetched
  //       setCategoriesList(prevCategories =>
  //         prevCategories.map(cat =>
  //           cat.name === category.name
  //             ? { ...cat, biomarkers: biomarkersData }
  //             : cat
  //         )
  //       );
  //       console.log("new",categoriesList);
        
  //     } catch (error) {
  //       setError(error.message);
  //     }
  //   };

  //   // Loop through categories and fetch biomarkers one by one
  //   categoriesList.forEach(category => {
  //     fetchBiomarkersForCategory(category);
  //   });

  // }, [categoriesList]); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL.BASE_URL}/business/v1/with-analyses`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        console.log("Fetched Categories:", data);

        // Initialize categories with an empty biomarkers array
        setCategoriesList(data);
      } catch (error) {
        setError(error.message);
      }finally{
        setLoading(false)
      }
    };



    fetchCategories();



    fetch(`${BASE_URL.BASE_URL}/business/v1/analysis/with-references`)
    .then(response => response.json())
    .then(data => {
      setBioMarkers(data);
    })
    .catch(error => {
      console.error('Error fetching biomarkers:', error);
      setLoading(false);
    });
  }, []);


  

  
  console.log("new", categoriesList);
  
  
  
  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleEdit = (category, e) => {
    e.stopPropagation();
    setEditingCategory(category);
  };

  const handleDelete = (categoryId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this category?')) {
      console.log("category Id" ,categoryId);
      deleteCategory(categoryId);
    }
  };
  const deleteCategory = async (categoryId) => {
    setLoading(true);
    try {
      const response =  await fetch(`${BASE_URL.BASE_URL}/business/v1/delete-category/${categoryId}`, {
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
      console.error("Error adding category:", error);
    }finally{
      setLoading(false)
    }
  };

  

  const handleSaveEdit = (editedCategory) => {
    console.log("edited",editedCategory);
    editCategory(editedCategory);
    setEditingCategory(null);
  };

  const addingCategory = async (newCategory) => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL.BASE_URL}/business/v1/category-with-analysis`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCategory),
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

    const editCategory = async (editedCategory) => {
      setLoading(true);

      try {
        const response = await fetch(`${BASE_URL.BASE_URL}/business/v1/update-category-with-medical-analysis`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedCategory),
        });

    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
          setLoading(false)
        }
    
        const data = await response.json();
        window.location.reload();
        alert('Data submitted Successfully')
        // console.log("Category added successfully:", data);
        return data;
      } catch (error) {
        console.error("Error adding category:", error);
      }finally{
        setLoading(false)
      }
    };
    


  

  const handleAddCategory = (newCategory) => {
    if(newCategory.medicalAnalyses.length===0){
      alert('you must choose medical analysis for this category');
      
    }else{
      
        console.log("new category" , newCategory);
        addingCategory(newCategory)
      
        setIsAddingCategory(false);

      
     

    }
    // setCategoriesList([...categoriesList, newCategory]);
   
  };

  // return (
  //   <div className="content-area">
  //     <div className="flex justify-between items-center mb-4">
  //       <h2 className="text-lg font-medium">Categories</h2>
  //       <button 
  //         className="btn btn-primary flex items-center gap-2"
  //         onClick={() => setIsAddingCategory(true)}
  //       >
  //         <Plus size={20} />
  //         Add Category
  //       </button>
  //     </div>

      

  //     <div className="grid gap-4">
  //       {categoriesList.map((category) => (
  //         <div key={category.id} className={`card ${expandedCategory === category.id ? 'border-primary' : ''}`}>
  //           <div 
  //             className="card-header flex justify-between items-center"
  //             onClick={() => toggleCategory(category.id)}
  //             style={{ cursor: 'pointer' }}
  //           >
  //             <div className="flex items-center gap-4">
  //               <div className="bg-primary bg-opacity-10 p-3 rounded">
  //                   {/* <category.icon className="text-primary" size={24} /> */}
  //               </div>
  //               <div>
  //                 <h5 className="text-lg font-medium mb-1">{category.name}</h5>
  //                 <small className="text-gray">
  //                 {category.medicalAnalyses?.length || 0} Biomarkers
  //                 </small>
  //               </div>
  //             </div>
  //             <div className="flex items-center gap-2">
  //               <button 
  //                 className="btn btn-light p-2 rounded-full"
  //                 onClick={(e) => handleEdit(category, e)}
  //               >
  //                 <Edit2 size={16} />
  //               </button>
  //               <button 
  //                 className="btn btn-light p-2 rounded-full"
  //                 onClick={(e) => handleDelete(category.id, e)}
  //               >
  //                 <Trash2 size={16} />
  //               </button>
  //               <button className="btn btn-light p-2 rounded-full">
  //                 {expandedCategory === category.id ? (
  //                   <ChevronUp size={16} />
  //                 ) : (
  //                   <ChevronDown size={16} />
  //                 )}
  //               </button>
  //             </div>
  //           </div>

  //           {expandedCategory === category.id && (
  //             <div className="card-body">
  //               <div className="grid gap-4">
  //                 <div>
  //                   <h6 className="text-sm font-medium mb-2">Description</h6>
  //                   <p className="text-gray">{category.description}</p>
  //                 </div>

  //                 <div>
  //                   <h6 className="text-sm font-medium mb-2">Biomarkers</h6>
  //                   <div className="table-container">
  //                     <table className="table">
  //                       <thead>
  //                         <tr>
  //                           <th>Name</th>
  //                           <th>Weight</th>
  //                         </tr>
  //                       </thead>
  //                       <tbody>
  //                         {category.medicalAnalyses?.map((biomarker, index) => (
  //                           <tr key={index}>
  //                             <td>{biomarker.name}</td>
  //                             <td>
  //                               <span className="badge badge-primary">
  //                                 {biomarker.weight}
  //                               </span>
  //                             </td>
  //                           </tr>
  //                         ))}
  //                       </tbody>
  //                     </table>
  //                   </div>
  //                 </div>

  //                 <div>
  //                   <h6 className="text-sm font-medium mb-2">Tips & Tricks</h6>
  //                   <div className="bg-primary bg-opacity-10 p-3 rounded text-primary">
  //                     {category.howToCalculate}
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           )}
  //         </div>
  //       ))}
  //     </div>

  //     {(editingCategory || isAddingCategory) && (
  //       <CategoryModal
  //         category={editingCategory}
  //         onClose={() => {
  //           setEditingCategory(null);
  //           setIsAddingCategory(false);
  //         }}
  //         onSave={editingCategory ? handleSaveEdit : handleAddCategory}
  //         isEditing={!!editingCategory}
  //       />
  //     )}
  //   </div>
  // );

  return (
    <div className="content-area">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Categories</h2>
        <button 
          className="btn btn-primary flex items-center gap-2"
          onClick={() => setIsAddingCategory(true)}
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>
  
      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>{/* You can replace this with any loader component */}
        </div>
      ) : (
        <div className="grid gap-4">
          {categoriesList.map((category) => (
            <div key={category.id} className={`card ${expandedCategory === category.id ? 'border-primary' : ''}`}>
              <div 
                className="card-header flex justify-between items-center"
                onClick={() => toggleCategory(category.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    {/* <category.icon className="text-primary" size={24} /> */}
                  </div>
                  <div>
                    <h5 className="text-lg font-medium mb-1">{category.name}</h5>
                    <small className="text-gray">
                      {category.medicalAnalyses?.length || 0} Biomarkers
                    </small>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="btn btn-light p-2 rounded-full"
                    onClick={(e) => handleEdit(category, e)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="btn btn-light p-2 rounded-full"
                    onClick={(e) => handleDelete(category.id, e)}
                  >
                    <Trash2 size={16} />
                  </button>
                  <button className="btn btn-light p-2 rounded-full">
                    {expandedCategory === category.id ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                </div>
              </div>
  
              {expandedCategory === category.id && (
                <div className="card-body">
                  <div className="grid gap-4">
                    <div>
                      <h6 className="text-sm font-medium mb-2">Description</h6>
                      <p className="text-gray">{category.description}</p>
                    </div>
  
                    <div>
                      <h6 className="text-sm font-medium mb-2">Biomarkers</h6>
                      <div className="table-container">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Weight</th>
                            </tr>
                          </thead>
                          <tbody>
                            {category.medicalAnalyses?.map((biomarker, index) => (
                              <tr key={index}>
                                <td>{biomarker.name}</td>
                                <td>
                                  <span className="badge badge-primary">
                                    {biomarker.weight}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
  
                    <div>
                      <h6 className="text-sm font-medium mb-2">Tips & Tricks</h6>
                      <div className="bg-primary bg-opacity-10 p-3 rounded text-primary">
                        {category.howToCalculate}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
  
      {(editingCategory || isAddingCategory) && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setEditingCategory(null);
            setIsAddingCategory(false);
          }}
          onSave={editingCategory ? handleSaveEdit : handleAddCategory}
          isEditing={!!editingCategory}
          loading={loading}
          bioMarkers={bioMarkers}
        />
      )}
    </div>
  );
  
}

export default Categories;