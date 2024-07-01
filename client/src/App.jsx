import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Applicant from './components/Applicant';
import Education from './components/Education';
import Application from './components/Application';
import Employment from './components/Employment';
import Reference from './components/Reference';
import AddApplicant from './components/AddApplicant';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/adminlogin" element={<Login />} />
        <Route path='/' element={<Dashboard />}>
        <Route path='' element={<Home />}></Route>
          <Route path="/dashboard/applicant" element={<Applicant />} />
          <Route path="/dashboard/education" element={<Education />} />
          <Route path="/dashboard/employment" element={<Employment />} />
          <Route path="/dashboard/application" element={<Application />} />
          <Route path="/dashboard/reference" element={<Reference />} />
          <Route path="/dashboard/add_applicant" element={<AddApplicant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
