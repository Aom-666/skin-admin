import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/UserFeedback.css';

function Feedback() {
    const navigate = useNavigate();

    // --- State สำหรับ UI ---
    const [feedbackList, setFeedbackList] = useState([]); // ✨ 1. เริ่มต้นด้วย Array ว่างเสมอ
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ทั้งหมด');
    const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
    const [filterRating, setFilterRating] = useState('ทั้งหมด');
    const [sortBy, setSortBy] = useState('dateDesc');

    // --- ดึงข้อมูลจาก API ทุกครั้งที่ Filter เปลี่ยน ---
    useEffect(() => {
        const fetchFeedback = async () => {
            const params = new URLSearchParams({ searchTerm, filterType, filterStatus, filterRating, sortBy });
            try {
                const response = await fetch(`http://localhost:5000/api/feedback?${params.toString()}`);
                const data = await response.json();
                setFeedbackList(data);
            } catch (error) {
                console.error("Failed to fetch feedback:", error);
            }
        };
        fetchFeedback();
    }, [searchTerm, filterType, filterStatus, filterRating, sortBy]);

    // ✨ 2. ลบ const filteredAndSortedFeedback ทั้งหมดทิ้งไป
    //    เราจะใช้ feedbackList ที่ได้จาก API โดยตรง

    const handleChangeStatus = async (id, newStatus) => {
        const token = localStorage.getItem('auth_token');
        try {
            await fetch(`http://localhost:5000/api/feedback/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            setFeedbackList(prevList =>
                prevList.map(feedback =>
                    feedback.FeedbackID === id ? { ...feedback, status: newStatus } : feedback
                )
            );
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        sessionStorage.removeItem('auth_token');
        navigate('/login');
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(<span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>);
        }
        return stars;
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Cosmetic Admin Panel</h1>
                <nav className="admin-nav">
                    <NavLink to="/dashboard">ภาพรวม</NavLink>
                    <NavLink to="/lookmanage">จัดการลุคการแต่งหน้า</NavLink>
                    <NavLink to="/feedback">ข้อเสนอแนะ</NavLink>
                    <NavLink to="/similarity">ผลการเทียบใบหน้า</NavLink>
                    <a href="#" onClick={handleLogout}>ออกจากระบบ</a>
                </nav>
            </header>

            <main className="admin-main">
                <div className="feedback-controls">
                    <input
                        type="text"
                        placeholder="ค้นหาความคิดเห็น..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <div className="filters-group">
                        <label>คะแนน:</label>
                        <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="filter-select">
                            <option value="ทั้งหมด">ทั้งหมด</option>
                            <option value="5">5 ดาว</option>
                            <option value="4">4 ดาว</option>
                            <option value="3">3 ดาว</option>
                            <option value="2">2 ดาว</option>
                            <option value="1">1 ดาว</option>
                        </select>
                        <label>เรียงตาม:</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
                            <option value="dateDesc">วันที่ (ใหม่สุด)</option>
                            <option value="dateAsc">วันที่ (เก่าสุด)</option>
                            <option value="ratingDesc">คะแนน (มากสุด)</option>
                            <option value="ratingAsc">คะแนน (น้อยสุด)</option>
                        </select>
                    </div>
                </div>

                <div className="feedback-list">
                    {/* ✨ 3. แก้ไขให้ map จาก feedbackList โดยตรง */}
                    {feedbackList.length > 0 ? (
                        feedbackList.map(feedback => (
                            <div key={feedback.FeedbackID} className="feedback-card">
                                <div className="feedback-meta">
                                    <span className="user-name">{feedback.userName}</span>
                                    <span className="feedback-date">{new Date(feedback.Date).toLocaleDateString('th-TH')}</span>
                                </div>
                                <div className="feedback-rating">{renderStars(feedback.Rating)}</div>
                                <p className="feedback-comment">{feedback.CommentText}</p>
                                <div className="feedback-info">
                                    <span className={`feedback-type type-${feedback.type?.replace('/', '-')}`}>{feedback.type}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-feedback">ไม่พบความคิดเห็นที่ตรงกับเงื่อนไข</p>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Feedback;
