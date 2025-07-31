import React, { useState } from 'react';
import '../css/Login.css'; // <<-- นี่คือการนำเข้าไฟล์ CSS ที่ถูกต้องตามโครงสร้างโฟลเดอร์ของคุณ

function Login() { // ชื่อ Component ที่ Export จะเป็น 'Login'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้าเมื่อกด Submit
    console.log('Username:', username);
    console.log('Password:', password);
    // *** ตรงนี้คือส่วนที่คุณจะนำ username และ password ไปตรวจสอบกับ Backend ***
    // ตัวอย่างการแจ้งเตือนง่ายๆ:
    alert(`คุณพยายามเข้าสู่ระบบด้วย Username: ${username} และ Password: ${password}`);
    // ในโปรเจกต์จริง เมื่อล็อกอินสำเร็จ คุณอาจใช้ React Router เพื่อเปลี่ยนหน้าไปที่ Dashboard
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Admin</h1>
        <form onSubmit={handleSubmit} className="login-form">
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

export default Login; // <<-- Export Component นี้ในชื่อ 'Login'