import React, { useState, useEffect } from 'react';

const ModuleInput = ({ module, onGradeChange, initialGrades }) => {
  const [tpGrade, setTpGrade] = useState('');
  const [examGrade, setExamGrade] = useState('');
  const [tpError, setTpError] = useState('');
  const [examError, setExamError] = useState('');

  useEffect(() => {
    if (initialGrades) {
      setTpGrade(initialGrades.tp || '');
      setExamGrade(initialGrades.exam || '');
    }
  }, [initialGrades]);

  const validateGrade = (value) => {
    if (value === '') return { isValid: true, message: '' };
    
    const num = parseFloat(value);
    if (isNaN(num)) {
      return { isValid: false, message: 'Please enter a valid number' };
    }
    
    if (num < 0 || num > 20) {
      return { isValid: false, message: 'Grade must be between 0 and 20' };
    }
    
    // Optional: Validate decimal places
    const decimalPlaces = (value.split('.')[1] || []).length;
    if (decimalPlaces > 2) {
      return { isValid: false, message: 'Maximum 2 decimal places allowed' };
    }
    
    return { isValid: true, message: '' };
  };

  const handleTpChange = (e) => {
    const value = e.target.value;
    setTpGrade(value);
    
    const validation = validateGrade(value);
    if (validation.isValid) {
      onGradeChange(module.id, 'tp', value);
      setTpError('');
    } else {
      onGradeChange(module.id, 'tp', '');
      setTpError(validation.message);
    }
  };

  const handleExamChange = (e) => {
    const value = e.target.value;
    setExamGrade(value);
    
    const validation = validateGrade(value);
    if (validation.isValid) {
      onGradeChange(module.id, 'exam', value);
      setExamError('');
    } else {
      onGradeChange(module.id, 'exam', '');
      setExamError(validation.message);
    }
  };

  const hasTp = module.evaluation.tp > 0;
  const hasExam = module.evaluation.exam > 0;

  const tpColSize = hasTp ? 4 : 0;
  const examColSize = hasExam ? 4 : 0;
  const infoColSize = hasTp && hasExam ? 3 : 6;
  const avgColSize = hasTp && hasExam ? 1 : 2;

  const calculateModuleAverage = () => {
    if (hasTp && hasExam && tpGrade && examGrade && !tpError && !examError) {
      const tp = parseFloat(tpGrade);
      const exam = parseFloat(examGrade);
      if (!isNaN(tp) && !isNaN(exam)) {
        return (tp * module.evaluation.tp / 100 + exam * module.evaluation.exam / 100).toFixed(2);
      }
    } else if (hasTp && !hasExam && tpGrade && !tpError) {
      const tp = parseFloat(tpGrade);
      if (!isNaN(tp)) return tp.toFixed(2);
    } else if (!hasTp && hasExam && examGrade && !examError) {
      const exam = parseFloat(examGrade);
      if (!isNaN(exam)) return exam.toFixed(2);
    }
    return null;
  };

  const moduleAverage = calculateModuleAverage();

  // CSS to hide number input arrows
  const numberInputStyle = {
    // For Chrome, Safari, Edge, Opera
    MozAppearance: 'textfield',
    // For Firefox
    WebkitAppearance: 'none',
    appearance: 'textfield',
    margin: 0,
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h6 className="card-subtitle mb-2 text-muted">{module.name}</h6>
        <div className="row">
          <div className={`col-md-${infoColSize}`}>
            <div className="mb-2">
              <small className="text-muted">Credits: {module.credits}</small>
            </div>
            <div>
              <small className="text-muted">Coefficient: {module.coefficient}</small>
            </div>
          </div>
          
          {hasTp && (
            <div className="col-md-4">
              <div className="input-group mb-2">
                <span className="input-group-text bg-info text-white">
                  TP 
                </span>
                <input
                  type="number"
                  className="form-control"
                  style={numberInputStyle}
                  value={tpGrade}
                  onChange={handleTpChange}
                  placeholder="0-20"
                  min="0"
                  max="20"
                  step="0.01"
                  // Hide spinner arrows in modern browsers
                  onWheel={(e) => e.target.blur()} // Prevent wheel from changing value
                />
              </div>
              {tpError && <div className="text-danger small">{tpError}</div>}
            </div>
          )}
          
          {hasExam && (
            <div className="col-md-4">
              <div className="input-group mb-2">
                <span className="input-group-text bg-warning">
                  Exam
                </span>
                <input
                  type="number"
                  className="form-control"
                  style={numberInputStyle}
                  value={examGrade}
                  onChange={handleExamChange}
                  placeholder="0-20"
                  min="0"
                  max="20"
                  step="0.01"
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              {examError && <div className="text-danger small">{examError}</div>}
            </div>
          )}
          
          <div className={`col-md-${avgColSize}`}>
            {moduleAverage !== null && (
              <div className="text-center">
                <small>Module Avg:</small>
                <div className="fw-bold">
                  {moduleAverage}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Alternative: Add this CSS to globally hide number input arrows */}
        <style jsx="true">{`
          /* Hide arrows for all number inputs */
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ModuleInput;
