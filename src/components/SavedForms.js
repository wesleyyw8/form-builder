import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SavedForms.css';

function SavedForms() {
  const [forms, setForms] = useState(() => {
    const savedForms = localStorage.getItem('formBuilder');
    return savedForms ? JSON.parse(savedForms) : [];
  });

  const deleteForm = (index) => {
    const newForms = forms.filter((_, i) => i !== index);
    setForms(newForms);
    localStorage.setItem('formBuilder', JSON.stringify(newForms));
  };

  return (
    <div className="saved-forms-page">
      <div className="saved-forms-header">
        <h1>Saved Forms</h1>
        <Link to="/form-builder" className="create-form-btn">
          Create New Form
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="no-forms">
          <p>No forms saved yet.</p>
          <Link to="/form-builder" className="create-form-btn">
            Create your first form
          </Link>
        </div>
      ) : (
        <div className="forms-grid">
          {forms.map((form, index) => (
            <div key={index} className="form-card">
              <div className="form-card-header">
                <h2>{form.name}</h2>
                <div className="form-actions">
                  <Link 
                    to={`/view-form/${index}`} 
                    className="view-form-btn"
                  >
                    View
                  </Link>
                  <button 
                    onClick={() => deleteForm(index)}
                    className="delete-form-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="form-fields">
                <p>{form.fields.length} fields</p>
                <div className="fields-list">
                  {form.fields.map(field => (
                    <div key={field.id} className="field-item">
                      <strong>{field.name}</strong> ({field.type})
                      {field.type === 'select' && (
                        <div className="field-options">
                          Options: {field.options.map(opt => opt.value).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedForms; 