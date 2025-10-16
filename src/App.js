// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Components ของคุณ
import Login from './component/Login'; // หน้า Login
import LookManagement from './component/LookManagement'; // หน้าจัดการสินค้า
import Dashboard from './component/Dashboard';
import Feedback from './component/Feedback';
import ProtectedRoute from './component/ProtectedRoute'; // ✨ เพิ่มบรรทัดนี้เข้าไป
import AdminSimilarityReport from './component/AdminSimilarityReport';
import ProductManagement from './component/ProductManagement';
import DataManager from './component/DataManager';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route สำหรับหน้า Login: เมื่อ URL เป็น '/' หรือ '/login' จะแสดง Login Component */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/lookmanage" element={<LookManagement />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path='/feedback' element={<Feedback/>} />
        <Route path='/similarity' element={<AdminSimilarityReport/>}/>
        <Route path='/product' element={<ProductManagement/>}/>
        <Route path='/data-manager' element={<DataManager/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;