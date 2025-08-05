import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✨ 1. Import useNavigate
import '../css/Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // ✨ 2. เพิ่ม State สำหรับเก็บ Error
    const navigate = useNavigate(); // ✨ 3. เรียกใช้ useNavigate

    // ✨ 4. เปลี่ยน handleSubmit ให้เป็น async function เพื่อรอผลลัพธ์จาก API
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // เคลียร์ error เก่าทุกครั้งที่กด submit

        try {
            // --- ส่วนที่เพิ่มเข้ามา ---
            // ส่ง request ไปยัง Backend API ของคุณ
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            // ถ้า Server ตอบกลับมาว่ามีปัญหา (เช่น รหัสผ่านผิด)
            if (!response.ok) {
                throw new Error(data.message || 'การเข้าสู่ระบบล้มเหลว');
            }

            // ถ้าสำเร็จ: เก็บ Token และเปลี่ยนหน้าไปที่ Dashboard
            console.log('เข้าสู่ระบบสำเร็จ:', data);
            localStorage.setItem('auth_token', data.token);
            navigate('/dashboard');

        } catch (err) {
            // ถ้าเกิด Error (เช่น API ปิด, รหัสผิด)
            console.error('เกิดข้อผิดพลาดในการ Login:', err.message);
            setError(err.message); // ตั้งค่าข้อความ Error เพื่อนำไปแสดงผล
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-card">
                <h1 className="login-title">Welcome Admin</h1>
                <form onSubmit={handleSubmit} className="login-form">
                    {/* ✨ 5. (Optional) เพิ่มส่วนแสดงข้อความ Error */}
                    {error && <p className="error-message">{error}</p>}

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        เข้าสู่ระบบ
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;