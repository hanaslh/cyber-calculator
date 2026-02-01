import React from 'react';

const ResultDisplay = ({ semesterAverage, semesterData, moduleGrades }) => {
  const calculateUnitAverages = () => {
  return semesterData.teachingUnits.map(unit => {
    let totalWeightedGrade = 0;
    let totalCoefficient = 0;

    unit.modules.forEach(module => {
      const grades = moduleGrades[module.id];
      
      // For modules with only Tp (English modules)
      if (module.evaluation.exam === 0 && grades && grades.tp) {
        const moduleGrade = parseFloat(grades.tp); // 100% from Tp
        totalWeightedGrade += moduleGrade * module.coefficient;
        totalCoefficient += module.coefficient;
      }
      // For modules with only Exam (shouldn't happen in your data, but keeping for completeness)
      else if (module.evaluation.tp === 0 && grades && grades.exam) {
        const moduleGrade = parseFloat(grades.exam); // 100% from Exam
        totalWeightedGrade += moduleGrade * module.coefficient;
        totalCoefficient += module.coefficient;
      }
      // For modules with both Tp and Exam
      else if (grades && grades.tp && grades.exam) {
        const moduleGrade = (
          (parseFloat(grades.tp) * module.evaluation.tp / 100) +
          (parseFloat(grades.exam) * module.evaluation.exam / 100)
        );
        totalWeightedGrade += moduleGrade * module.coefficient;
        totalCoefficient += module.coefficient;
      }
    });

    return {
      name: unit.name,
      average: totalCoefficient > 0 ? (totalWeightedGrade / totalCoefficient).toFixed(2) : '-',
      coefficient: unit.coefficient
    };
  });
};

  const unitAverages = calculateUnitAverages();

  return (
    <div className="card mt-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Results</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h6>Teaching Unit Averages:</h6>
            <ul className="list-group">
              {unitAverages.map((unit, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between">
                  <span>{unit.name}</span>
                  <span className="badge bg-primary rounded-pill">
                    {unit.average}/20
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-6">
            <div className="text-center">
              <h6>Semester Average</h6>
              <div className={`display-4 fw-bold ${semesterAverage >= 10 ? 'text-success' : 'text-danger'}`}>
                {semesterAverage.toFixed(2)}
              </div>
              <div className="mt-2">
                <span className="badge bg-info">Total Coefficient: {semesterData.totalCoefficient}</span>
              </div>
              <div className="mt-3">
                <div className={`alert ${semesterAverage >= 10 ? 'alert-success' : 'alert-danger'}`}>
                  {semesterAverage >= 10 ? '✅ Semester Passed!' : '❌ Semester Failed'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;