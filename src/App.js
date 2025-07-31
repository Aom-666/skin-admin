// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Components ของคุณ
import Login from './component/Login'; // หน้า Login
import ProductManagement from './component/ProductManagement'; // หน้าจัดการสินค้า
import Dashboard from './component/Dashboard';
import Feedback from './component/Feedback';

// (Optional) Import Global CSS ที่ใช้กับทั้งแอป ถ้ามี
// import './index.css';
// import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route สำหรับหน้า Login: เมื่อ URL เป็น '/' หรือ '/login' จะแสดง Login Component */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path='/feedback' element={<Feedback/>} />
        {/* หากต้องการเพิ่มหน้า 404 Not Found (ถ้าผู้ใช้พิมพ์ URL ผิด) */}
        {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
      </Routes>
    </Router>
  );
}

export default App;