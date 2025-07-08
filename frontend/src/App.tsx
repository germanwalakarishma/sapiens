import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserList from './components/UserList';
import CreateUser from './components/CreateUser';
import Navbar from './components/NavBar';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/create" element={<CreateUser />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;