import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // เราจะใช้ library นี้เพื่อถอดรหัส Token

// Component นี้จะทำหน้าที่เป็น "ด่านตรวจ"
const ProtectedRoute = ({ allowedRoles }) => {
    // 1. ดึง Token จาก sessionStorage
    const token = sessionStorage.getItem('auth_token');

    // --- ด่านตรวจที่ 1: ตรวจสอบว่ามี Token หรือไม่ (Login หรือยัง?) ---
    if (!token) {
        // ถ้าไม่มี Token ให้ส่งกลับไปที่หน้า Login ทันที
        return <Navigate to="/login" />;
    }

    // --- ด่านตรวจที่ 2: ตรวจสอบ Role (มีสิทธิ์เข้าถึงหรือไม่?) ---
    try {
        // ถอดรหัส Token เพื่อดูข้อมูลข้างใน (เช่น role)
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        // ตรวจสอบว่า role ของผู้ใช้ อยู่ในกลุ่มของ role ที่หน้านี้อนุญาตหรือไม่
        // allowedRoles คือ ['admin'] ที่เราส่งมาจาก App.js
        const isAllowed = allowedRoles.includes(userRole);

        // ถ้าได้รับอนุญาต, ให้แสดงหน้าต่อไป (<Outlet />)
        // ถ้าไม่ได้รับอนุญาต, ให้ไปหน้า "ไม่ได้รับอนุญาต"
        return isAllowed ? <Outlet /> : <Navigate to="/unauthorized" />;
        
    } catch (error) {
        // ถ้า Token มีปัญหาหรือไม่ถูกต้อง (เช่น หมดอายุ) ให้ลบ Token ทิ้งแล้วส่งกลับไปหน้า Login
        console.error("Invalid token:", error);
        sessionStorage.removeItem('auth_token');
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;
