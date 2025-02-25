import { useState, useEffect } from 'react';
import '../styles/FormBuilder.css';
import { api } from '../services/api';

interface Option {
  id: number;
  value: string;
}

interface Field {
  id: number;
  name: string;
  type: 'text' | 'select';
  options: Option[];
}

interface Form {
  name: string;
  fields: Field[];
}

interface FormBuilderProps {}

const FormBuilder: React.FC<FormBuilderProps> = () => {
  const [forms, setForms] = useState<Form[]>(() => {
    const savedForms = localStorage.getItem('formBuilder');
    return savedForms ? JSON.parse(savedForms) : [];
  });
  
  const [currentForm, setCurrentForm] = useState<Form>({
    name: '',
    fields: []
  });

  const [editingFormIndex, setEditingFormIndex] = useState<number | null>(null);
  const [expandedForm, setExpandedForm] = useState<number | null>(null);

  useEffect(() => {
    const loadForms = async () => {
      try {
        const loadedForms = await api.getForms();
        setForms(loadedForms);
      } catch (error) {
        console.error('Error loading forms:', error);
      }
    };
    loadForms();
  }, []);

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
        options: []
      }]
    }));
  };

  const updateField = (fieldId: number, updates: Partial<Pick<Field, 'name' | 'type'>>) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (fieldId: number) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const addOption = (fieldId: number) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId 
          ? { ...field, options: [...field.options, { id: Date.now(), value: '' }] }
          : field
      )
    }));
  };

  const updateOption = (fieldId: number, optionId: number, value: string) => {
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

  const removeOption = (fieldId: number, optionId: number) => {
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

  const saveForm = async () => {
    if (!currentForm.name.trim()) {
      alert('Please enter a tab name');
      return;
    }
    if (currentForm.fields.some(field => !field.name.trim())) {
      alert('All fields must have names');
      return;
    }

    try {
      if (editingFormIndex !== null) {
        const updatedForm = await api.updateForm(forms[editingFormIndex].id, currentForm);
        setForms(prev => prev.map((form, index) => 
          index === editingFormIndex ? updatedForm : form
        ));
      } else {
        const newForm = await api.createForm(currentForm);
        setForms(prev => [...prev, newForm]);
      }

      setCurrentForm({ name: '', fields: [] });
      setEditingFormIndex(null);
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Error saving form. Please try again.');
    }
  };

  const editForm = (index: number) => {
    setCurrentForm(forms[index]);
    setEditingFormIndex(index);
    window.scrollTo(0, 0);
  };

  const cancelEdit = () => {
    setCurrentForm({ name: '', fields: [] });
    setEditingFormIndex(null);
  };

  return (
    <div className="form-builder">
      <h1>{editingFormIndex !== null ? 'Edit Tab' : 'Create New Tab'}</h1>
      
      <div className="form-header">
        <input
          type="text"
          placeholder="Tab Name"
          value={currentForm.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setCurrentForm(prev => ({ ...prev, name: e.target.value }))}
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
        {currentForm.fields.map((field: Field) => (
          <div key={field.id} className="field-item">
            <div className="field-header">
              <input
                type="text"
                placeholder="Field Name"
                value={field.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  updateField(field.id, { name: e.target.value })}
                className="field-name-input"
              />
              <select
                value={field.type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  updateField(field.id, { type: e.target.value as 'text' | 'select' })}
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
                {field.options.map((option: Option) => (
                  <div key={option.id} className="option-item">
                    <input
                      type="text"
                      placeholder="Option Value"
                      value={option.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateOption(field.id, option.id, e.target.value)}
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
              {forms.map((form: Form, index: number) => (
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
                        {form.fields.map((field: Field) => (
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
};

export default FormBuilder; 