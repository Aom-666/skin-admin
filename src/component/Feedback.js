import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/UserFeedback.css'; // สร้างไฟล์ CSS ใหม่สำหรับ UserFeedback
function Feedback(){
  const navigate = useNavigate();
    const handleLogout = (e) => {
    e.preventDefault();

    console.log("กำลังออกจากระบบ...");
    localStorage.removeItem('auth_token');
    navigate('/login');

  }
     const [feedbackList, setFeedbackList] = useState([
    {
      id: 1,
      userName: 'Alice B.',
      rating: 5,
      comment: 'ประทับใจมากค่ะ! ระบบวิเคราะห์สีผิวแม่นยำและสินค้าที่แนะนำก็ตรงใจสุดๆ เลยค่ะ',
      type: 'คำชม',
      status: 'ยังไม่ได้อ่าน',
      date: '2025-07-15'
    },
    {
      id: 2,
      userName: 'Bob S.',
      rating: 4,
      comment: 'อยากให้เพิ่มฟังก์ชันเปรียบเทียบสินค้ารุ่นใกล้เคียงกันครับ',
      type: 'ข้อเสนอแนะ',
      status: 'อ่านแล้ว',
      date: '2025-07-14'
    },
    {
      id: 3,
      userName: 'Charlie D.',
      rating: 2,
      comment: 'รูปภาพสินค้าบางรายการโหลดช้ามากเลยครับ ทำให้ประสบการณ์ใช้งานไม่ดีเท่าที่ควร',
      type: 'ปัญหา/บั๊ก',
      status: 'กำลังดำเนินการ',
      date: '2025-07-13'
    },
    {
      id: 4,
      userName: 'Diana P.',
      rating: 5,
      comment: 'ชอบสไตล์การแต่งหน้าแบบ Korean Style ที่แนะนำค่ะ หาซื้อสินค้าได้ง่ายด้วย',
      type: 'คำชม',
      status: 'แก้ไขแล้ว',
      date: '2025-07-12'
    },
    {
      id: 5,
      userName: 'Eve R.',
      rating: 3,
      comment: 'หน้า Predict สีผิวบางครั้งขึ้น Error อยากให้ปรับปรุงหน่อยครับ',
      type: 'ปัญหา/บั๊ก',
      status: 'ยังไม่ได้อ่าน',
      date: '2025-07-11'
    },
    {
      id: 6,
      userName: 'Frank G.',
      rating: 4,
      comment: 'มีสินค้าสำหรับผิวมันให้เลือกน้อยไปหน่อยครับ',
      type: 'ข้อเสนอแนะ',
      status: 'อ่านแล้ว',
      date: '2025-07-10'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ทั้งหมด');
  const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
  const [sortBy, setSortBy] = useState('dateDesc'); // dateDesc, dateAsc, ratingDesc, ratingAsc

  const filteredAndSortedFeedback = feedbackList
    .filter(feedback => {
      // Filter by search term
      const matchesSearch = feedback.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            feedback.comment.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by type
      const matchesType = filterType === 'ทั้งหมด' || feedback.type === filterType;

      // Filter by status
      const matchesStatus = filterStatus === 'ทั้งหมด' || feedback.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by
      if (sortBy === 'dateDesc') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'dateAsc') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'ratingDesc') {
        return b.rating - a.rating;
      } else if (sortBy === 'ratingAsc') {
        return a.rating - b.rating;
      }
      return 0;
    });

  // ฟังก์ชันสำหรับเปลี่ยนสถานะ (ตัวอย่าง)
  const handleChangeStatus = (id, newStatus) => {
    setFeedbackList(prevList =>
      prevList.map(feedback =>
        feedback.id === id ? { ...feedback, status: newStatus } : feedback
      )
    );
  };

  // ฟังก์ชันสำหรับแสดงดาว
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <h1>Cosmetic Admin Panel</h1>
        <nav className="admin-nav">
          <NavLink to="/dashboard">ภาพรวม</NavLink>
          <NavLink to="/products">จัดการสินค้า</NavLink>
          <NavLink to="/feedback">ข้อเสนอแนะ</NavLink>
          <a href="#" onClick={handleLogout}>ออกจากระบบ</a>
        </nav>
      </header>

      <div className="feedback-controls">
        <input
          type="text"
          placeholder="ค้นหาความคิดเห็น (ชื่อ/ข้อความ)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="filters-group">
          <label htmlFor="filterType">ประเภท:</label>
          <select
            id="filterType"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="คำชม">คำชม</option>
            <option value="ข้อเสนอแนะ">ข้อเสนอแนะ</option>
            <option value="ปัญหา/บั๊ก">ปัญหา/บั๊ก</option>
          </select>

          <label htmlFor="filterStatus">สถานะ:</label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="ยังไม่ได้อ่าน">ยังไม่ได้อ่าน</option>
            <option value="อ่านแล้ว">อ่านแล้ว</option>
            <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
            <option value="แก้ไขแล้ว">แก้ไขแล้ว</option>
          </select>

          <label htmlFor="sortBy">เรียงตาม:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="dateDesc">วันที่ (ใหม่สุด)</option>
            <option value="dateAsc">วันที่ (เก่าสุด)</option>
            <option value="ratingDesc">คะแนน (มากสุด)</option>
            <option value="ratingAsc">คะแนน (น้อยสุด)</option>
          </select>
        </div>
      </div>

      <div className="feedback-list">
        {filteredAndSortedFeedback.length > 0 ? (
          filteredAndSortedFeedback.map(feedback => (
            <div key={feedback.id} className="feedback-card">
              <div className="feedback-meta">
                <span className="user-name">{feedback.userName}</span>
                <span className="feedback-date">{feedback.date}</span>
              </div>
              <div className="feedback-rating">
                {renderStars(feedback.rating)}
              </div>
              <p className="feedback-comment">{feedback.comment}</p>
              <div className="feedback-info">
                <span className={`feedback-type ${feedback.type.replace('/', '-')}`}>{feedback.type}</span>
                <span className={`feedback-status ${feedback.status.replace(/\s+/g, '-')}`}>{feedback.status}</span>
              </div>
              <div className="feedback-actions">
                <select
                  value={feedback.status}
                  onChange={(e) => handleChangeStatus(feedback.id, e.target.value)}
                  className="action-select"
                >
                  <option value="ยังไม่ได้อ่าน">ยังไม่ได้อ่าน</option>
                  <option value="อ่านแล้ว">อ่านแล้ว</option>
                  <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                  <option value="แก้ไขแล้ว">แก้ไขแล้ว</option>
                </select>
                {/* อาจมีปุ่มลบ หรือปุ่มอื่นๆ เพิ่มเติมในอนาคต */}
                {/* <button className="delete-button">ลบ</button> */}
              </div>
            </div>
          ))
        ) : (
          <p className="no-feedback">ไม่พบความคิดเห็นที่ตรงกับเงื่อนไข.</p>
        )}
      </div>
    </div>
  );
}
export default Feedback;