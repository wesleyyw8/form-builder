import { useState, useEffect } from 'react';
import '../styles/FormBuilder.css';

function FormBuilder() {
  const [forms, setForms] = useState(() => {
    const savedForms = localStorage.getItem('formBuilder');
    console.log('Loading saved forms:', savedForms); // Debug log
    return savedForms ? JSON.parse(savedForms) : [];
  });
  
  const [currentForm, setCurrentForm] = useState({
    name: '',
    fields: []
  });

  const [editingFormIndex, setEditingFormIndex] = useState(null);
  const [expandedForm, setExpandedForm] = useState(null);

  useEffect(() => {
    localStorage.setItem('formBuilder', JSON.stringify(forms));
  }, [forms]);

  const addField = () => {
    setCurrentForm(prev => ({
      ...prev,
      fields: [...prev.fields, {
        id: Date.now(),
        name: '',
        type: 'text',
        options: [] // for select fields
      }]
    }));
  };

  const updateField = (fieldId, updates) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (fieldId) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const addOption = (fieldId) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId 
          ? { ...field, options: [...field.options, { id: Date.now(), value: '' }] }
          : field
      )
    }));
  };

  const updateOption = (fieldId, optionId, value) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId 
          ? {
              ...field,
              options: field.options.map(option =>
                option.id === optionId ? { ...option, value } : option
              )
            }
          : field
      )
    }));
  };

  const removeOption = (fieldId, optionId) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId 
          ? {
              ...field,
              options: field.options.filter(option => option.id !== optionId)
            }
          : field
      )
    }));
  };

  const saveForm = () => {
    if (!currentForm.name.trim()) {
      alert('Please enter a tab name');
      return;
    }
    if (currentForm.fields.some(field => !field.name.trim())) {
      alert('All fields must have names');
      return;
    }

    if (editingFormIndex !== null) {
      // Update existing tab
      setForms(prev => prev.map((form, index) => 
        index === editingFormIndex ? currentForm : form
      ));
    } else {
      // Add new tab
      setForms(prev => [...prev, currentForm]);
    }

    // Reset current tab and editing state
    setCurrentForm({ name: '', fields: [] });
    setEditingFormIndex(null);
  };

  const editForm = (index) => {
    setCurrentForm(forms[index]);
    setEditingFormIndex(index);
    window.scrollTo(0, 0); // Scroll to top to see the tab editor
  };

  const cancelEdit = () => {
    setCurrentForm({ name: '', fields: [] });
    setEditingFormIndex(null);
  };

  console.log('Current tabs:', forms); // Debug log

  return (
    <div className="form-builder">
      <h1>{editingFormIndex !== null ? 'Edit Tab' : 'Create New Tab'}</h1>
      
      <div className="form-header">
        <input
          type="text"
          placeholder="Tab Name"
          value={currentForm.name}
          onChange={(e) => setCurrentForm(prev => ({ ...prev, name: e.target.value }))}
          className="form-name-input"
        />
        <button onClick={addField} className="add-field-btn">Add Field</button>
        {editingFormIndex !== null && (
          <button onClick={cancelEdit} className="cancel-btn">
            Cancel Edit
          </button>
        )}
      </div>

      <div className="fields-container">
        {currentForm.fields.map(field => (
          <div key={field.id} className="field-item">
            <div className="field-header">
              <input
                type="text"
                placeholder="Field Name"
                value={field.name}
                onChange={(e) => updateField(field.id, { name: e.target.value })}
                className="field-name-input"
              />
              <select
                value={field.type}
                onChange={(e) => updateField(field.id, { type: e.target.value })}
                className="field-type-select"
              >
                <option value="text">Text</option>
                <option value="select">Select</option>
              </select>
              <button 
                onClick={() => removeField(field.id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>

            {field.type === 'select' && (
              <div className="options-container">
                <button 
                  onClick={() => addOption(field.id)}
                  className="add-option-btn"
                >
                  Add Option
                </button>
                {field.options.map(option => (
                  <div key={option.id} className="option-item">
                    <input
                      type="text"
                      placeholder="Option Value"
                      value={option.value}
                      onChange={(e) => updateOption(field.id, option.id, e.target.value)}
                      className="option-input"
                    />
                    <button 
                      onClick={() => removeOption(field.id, option.id)}
                      className="remove-option-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {currentForm.fields.length > 0 && (
        <button onClick={saveForm} className="save-form-btn">
          {editingFormIndex !== null ? 'Update Tab' : 'Save Tab'}
        </button>
      )}

      <div className="saved-forms">
        <h2>Saved Tabs</h2>
        <div className="table-container">
          <table className="forms-table">
            <thead>
              <tr>
                <th>Tab Name</th>
                <th>Fields</th>
                <th>Last Modified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form, index) => (
                <tr key={index} className="form-row">
                  <td>{form.name}</td>
                  <td>
                    <div className="field-count">
                      {form.fields.length} fields
                      <button 
                        className="view-fields-btn"
                        onClick={() => setExpandedForm(expandedForm === index ? null : index)}
                      >
                        {expandedForm === index ? 'Hide' : 'View'}
                      </button>
                    </div>
                    {expandedForm === index && (
                      <div className="fields-preview">
                        {form.fields.map(field => (
                          <div key={field.id} className="field-preview">
                            <span className="field-name">{field.name}</span>
                            <span className="field-type">({field.type})</span>
                            {field.type === 'select' && (
                              <div className="field-options">
                                Options: {field.options.map(opt => opt.value).join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td>{new Date().toLocaleDateString()}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        onClick={() => editForm(index)}
                        className="edit-form-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this tab?')) {
                            const newForms = forms.filter((_, i) => i !== index);
                            setForms(newForms);
                          }
                        }}
                        className="delete-form-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FormBuilder; 