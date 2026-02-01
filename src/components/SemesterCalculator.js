import React, { useState, useEffect } from 'react';
import ModuleInput from './ModuleInput';
import ResultDisplay from './ResultDisplay';

const SemesterCalculator = ({ semesterData }) => {
  const [moduleGrades, setModuleGrades] = useState({});
  const [semesterAverage, setSemesterAverage] = useState(0);

  // Generate a unique key for localStorage based on semester
  const storageKey = `cybersecurity-grades-${semesterData.title.replace(/\s+/g, '-').toLowerCase()}`;

  // Load grades from localStorage on component mount
  useEffect(() => {
    const savedGrades = localStorage.getItem(storageKey);
    if (savedGrades) {
      setModuleGrades(JSON.parse(savedGrades));
    } else {
      // Initialize with empty grades if nothing saved
      const initialGrades = {};
      semesterData.teachingUnits.forEach(unit => {
        unit.modules.forEach(module => {
          initialGrades[module.id] = { tp: '', exam: '' };
        });
      });
      setModuleGrades(initialGrades);
    }
  }, [semesterData]);

  // Save grades to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(moduleGrades));
  }, [moduleGrades, storageKey]);

  const handleGradeChange = (moduleId, type, value) => {
    setModuleGrades(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [type]: value
      }
    }));
  };

  // Calculate average whenever grades change
  useEffect(() => {
    calculateAverage();
  }, [moduleGrades]);

  const calculateAverage = () => {
    let totalWeightedGrade = 0;
    let totalCoefficient = 0;

    semesterData.teachingUnits.forEach(unit => {
      unit.modules.forEach(module => {
        const grades = moduleGrades[module.id];
        
        // For modules with only Tp (English modules)
        if (module.evaluation.exam === 0 && grades && grades.tp) {
          const tpGrade = parseFloat(grades.tp);
          if (!isNaN(tpGrade)) {
            const moduleGrade = tpGrade; // 100% from Tp
            totalWeightedGrade += moduleGrade * module.coefficient;
            totalCoefficient += module.coefficient;
          }
        }
        // For modules with only Exam (shouldn't happen in your data, but keeping for completeness)
        else if (module.evaluation.tp === 0 && grades && grades.exam) {
          const examGrade = parseFloat(grades.exam);
          if (!isNaN(examGrade)) {
            const moduleGrade = examGrade; // 100% from Exam
            totalWeightedGrade += moduleGrade * module.coefficient;
            totalCoefficient += module.coefficient;
          }
        }
        // For modules with both Tp and Exam
        else if (grades && grades.tp && grades.exam) {
          const tpGrade = parseFloat(grades.tp);
          const examGrade = parseFloat(grades.exam);
          if (!isNaN(tpGrade) && !isNaN(examGrade)) {
            const moduleGrade = (
              (tpGrade * module.evaluation.tp / 100) +
              (examGrade * module.evaluation.exam / 100)
            );
            totalWeightedGrade += moduleGrade * module.coefficient;
            totalCoefficient += module.coefficient;
          }
        }
      });
    });

    const average = totalCoefficient > 0 ? totalWeightedGrade / totalCoefficient : 0;
    setSemesterAverage(average);
  };

  const resetGrades = () => {
    // Clear from localStorage
    localStorage.removeItem(storageKey);
    
    // Reset state
    const resetGrades = {};
    semesterData.teachingUnits.forEach(unit => {
      unit.modules.forEach(module => {
        resetGrades[module.id] = { tp: '', exam: '' };
      });
    });
    setModuleGrades(resetGrades);
    
    // Show confirmation
    alert('All grades have been reset!');
  };

  // Function to export grades as JSON
  const exportGrades = () => {
    const dataStr = JSON.stringify(moduleGrades, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${semesterData.title}-grades.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Function to import grades from file
  const importGrades = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedGrades = JSON.parse(e.target.result);
        setModuleGrades(importedGrades);
        alert('Grades imported successfully!');
      } catch (error) {
        alert('Error importing grades. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset the file input
    event.target.value = '';
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">{semesterData.title} - Cybersecurity</h4>
          <small>Enter your grades for each module (out of 20)</small>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              {semesterData.teachingUnits.map((unit, unitIndex) => (
                <div key={unitIndex} className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>{unit.name}</h5>
                    <span className="badge bg-secondary">
                      Coefficient: {unit.coefficient}
                    </span>
                  </div>
                  {unit.modules.map((module, moduleIndex) => (
                    <ModuleInput
                      key={module.id}
                      module={module}
                      onGradeChange={handleGradeChange}
                      initialGrades={moduleGrades[module.id]}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <ResultDisplay 
            semesterAverage={semesterAverage}
            semesterData={semesterData}
            moduleGrades={moduleGrades}
          />

          <div className="mt-3 text-center">
            <div className="btn-group" role="group">
              <button className="btn btn-warning" onClick={resetGrades}>
                Reset All Grades
              </button>
              <button className="btn btn-info" onClick={exportGrades}>
                Export Grades
              </button>
              <label className="btn btn-success">
                Import Grades
                <input
                  type="file"
                  accept=".json"
                  onChange={importGrades}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <div className="mt-2">
              <small className="text-muted">
                Grades are saved automatically. You can export/import them for backup.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemesterCalculator;