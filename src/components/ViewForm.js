import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/ViewForm.css';

function ViewForm() {
  const { formIndex } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem('formBuilder') || '[]');
    if (savedForms[formIndex]) {
      setForm(savedForms[formIndex]);
      // Initialize form data
      const initialData = {};
      savedForms[formIndex].fields.forEach(field => {
        initialData[field.id] = field.type === 'select' ? '' : '';
      });
      setFormData(initialData);
    }
  }, [formIndex]);

  const addField = () => {
    const newField = {
      id: Date.now(),
      name: '',
      type: 'text',
      options: []
    };

    const updatedForm = {
      ...form,
      fields: [...form.fields, newField]
    };
    setForm(updatedForm);

    // Update localStorage
    const savedForms = JSON.parse(localStorage.getItem('formBuilder') || '[]');
    savedForms[formIndex] = updatedForm;
    localStorage.setItem('formBuilder', JSON.stringify(savedForms));
  };

  const updateField = (fieldId, updates) => {
    const updatedForm = {
      ...form,
      fields: form.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    };
    setForm(updatedForm);

    // Update localStorage
    const savedForms = JSON.parse(localStorage.getItem('formBuilder') || '[]');
    savedForms[formIndex] = updatedForm;
    localStorage.setItem('formBuilder', JSON.stringify(savedForms));
  };

  const removeField = (fieldId) => {
    const updatedForm = {
      ...form,
      fields: form.fields.filter(field => field.id !== fieldId)
    };
    setForm(updatedForm);

    // Update localStorage
    const savedForms = JSON.parse(localStorage.getItem('formBuilder') || '[]');
    savedForms[formIndex] = updatedForm;
    localStorage.setItem('formBuilder', JSON.stringify(savedForms));
  };

  const addOption = (fieldId) => {
    const updatedForm = {
      ...form,
      fields: form.fields.map(field =>
        field.id === fieldId
          ? { ...field, options: [...field.options, { id: Date.now(), value: '' }] }
          : field
      )
    };
    setForm(updatedForm);

    // Update localStorage
    const savedForms = JSON.parse(localStorage.getItem('formBuilder') || '[]');
    savedForms[formIndex] = updatedForm;
    localStorage.setItem('formBuilder', JSON.stringify(savedForms));
  };

  const updateOption = (fieldId, optionId, value) => {
    const updatedForm = {
      ...form,
      fields: form.fields.map(field =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options.map(option =>
                option.id === optionId ? { ...option, value } : option
              )
            }
          : field
      )
    };
    setForm(updatedForm);

    // Update localStorage
    const savedForms = JSON.parse(localStorage.getItem('formBuilder') || '[]');
    savedForms[formIndex] = updatedForm;
    localStorage.setItem('formBuilder', JSON.stringify(savedForms));
  };

  const removeOption = (fieldId, optionId) => {
    const updatedForm = {
      ...form,
      fields: form.fields.map(field =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options.filter(option => option.id !== optionId)
            }
          : field
      )
    };
    setForm(updatedForm);

    // Update localStorage
    const savedForms = JSON.parse(localStorage.getItem('formBuilder') || '[]');
    savedForms[formIndex] = updatedForm;
    localStorage.setItem('formBuilder', JSON.stringify(savedForms));
  };

  if (!form) {
    return <div className="form-not-found">Form not found</div>;
  }

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    // Here you could save the form data or process it further
    alert('Form submitted successfully!');
  };

  return (
    <div className="view-form">
      <div className="view-form-header">
        <h1>{form.name}</h1>
        <div className="header-actions">
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="edit-btn"
          >
            {isEditing ? 'View Form' : 'Edit Form'}
          </button>
          <Link to="/saved-forms" className="back-btn">
            Back to Forms
          </Link>
        </div>
      </div>

      {isEditing ? (
        <div className="edit-form">
          <button onClick={addField} className="add-field-btn">
            Add New Field
          </button>
          <div className="fields-container">
            {form.fields.map(field => (
              <div key={field.id} className="field-item">
                <div className="field-header">
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateField(field.id, { name: e.target.value })}
                    placeholder="Field Name"
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
                          value={option.value}
                          onChange={(e) => updateOption(field.id, option.id, e.target.value)}
                          placeholder="Option Value"
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
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="form-content">
          {form.fields.map(field => (
            <div key={field.id} className="form-field">
              <label htmlFor={field.id}>{field.name}</label>
              
              {field.type === 'text' ? (
                <input
                  type="text"
                  id={field.id}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="form-input"
                />
              ) : (
                <select
                  id={field.id}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="form-select"
                >
                  <option value="">Select an option</option>
                  {field.options.map(option => (
                    <option key={option.id} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}

          <button type="submit" className="submit-btn">
            Submit Form
          </button>
        </form>
      )}
    </div>
  );
}

export default ViewForm; 