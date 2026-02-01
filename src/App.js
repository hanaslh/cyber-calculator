import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SemesterCalculator from './components/SemesterCalculator';
import { semestersData } from './data/modulesData';

function App() {
  const [selectedSemester, setSelectedSemester] = useState('semester1');

  return (
    <div className="App">
      <header className="bg-gradient py-4">
        <div className="container">
          <h1 className="text-center text-black">Cybersecurity Grade Calculator</h1>
          <p className="text-center text-dark">Calculate your semester average </p>
        </div>
      </header>

      <main>
        <div className="container py-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Select Semester</h5>
              <div className="btn-group" role="group">
                {Object.keys(semestersData).map(key => (
                  <button
                    key={key}
                    type="button"
                    className={`btn ${selectedSemester === key ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedSemester(key)}
                  >
                    {semestersData[key].title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <SemesterCalculator semesterData={semestersData[selectedSemester]} />
        </div>
      </main>

      <footer className="bg-dark text-white py-3 mt-4">
        <div className="container text-center">
          <small>Cybersecurity Speciality - Grade Calculator v1.0</small>
        </div>
      </footer>
    </div>
  );
}

export default App;