import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/UserFeedback.css';

// --- ไอคอน ---
const SearchIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> );
const StarIcon = ({ filled }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "#e5e7eb"} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> );

// --- คอมโพเนนท์หลัก ---
function Feedback() {
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]); // ✨ แก้ไข: ใช้ชื่อ feedbacks ให้ตรงกัน
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState('ทั้งหมด');
    const [sortBy, setSortBy] = useState('dateDesc');

    const handleLogout = (e) => {
        e.preventDefault();
        sessionStorage.removeItem('auth_token');
        navigate('/login');
    };

    // ดึงข้อมูล Feedback จาก API
    useEffect(() => {
        const fetchFeedbacks = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({ searchTerm, filterRating, sortBy });
                const response = await fetch(`http://localhost:5000/api/feedback?${params.toString()}`);
                const data = await response.json();
                setFeedbacks(data); // ✨ แก้ไข: ใช้ setFeedbacks
            } catch (error) {
                console.error("Failed to fetch feedbacks", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, [searchTerm, filterRating, sortBy]);

    const renderTableContent = () => {
        if (loading) return <tr><td colSpan="3" className="status-text">กำลังโหลดข้อมูล...</td></tr>;
        if (feedbacks.length === 0) return <tr><td colSpan="3" className="status-text">ไม่พบข้อมูลที่ตรงกัน</td></tr>;

        // ✨ แก้ไข: map จาก feedbacks โดยตรง
        return feedbacks.map(fb => (
            <tr key={fb.FeedbackID}>
                {/* ✨ 1. แยก td สำหรับชื่อผู้ใช้ และ วันที่ ✨ */}
                <td><span className="user-name">{fb.userName}</span></td>
                <td><span className="feedback-date">{new Date(fb.Date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span></td>
                <td><div className="rating-stars">{[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < fb.Rating} />)}</div></td>
                <td className="comment-text">{fb.CommentText}</td>
            </tr>
        ));
    };

    return (
        <div className="feedback-page-container">
            <header className="feedback-header">
                <div className="logo">Cosmetic Admin Panel</div>
                <nav className="feedback-nav">
                    <NavLink to="/dashboard">ภาพรวม</NavLink>
                    <NavLink to="/data-manager">จัดการข้อมูล</NavLink>
                    <NavLink to="/feedback">ข้อเสนอแนะ</NavLink>
                    <NavLink to="/similarity">ผลการเทียบใบหน้า</NavLink>
                    <a href="#" onClick={handleLogout}>ออกจากระบบ</a>
                </nav>
            </header>
            
            <main className="feedback-main-content">
                <div className="feedback-content-card">
                    <div className="filter-bar">
                        <div className="filter-search-group">
                            <span className="filter-search-icon"><SearchIcon /></span>
                            <input type="text" className="filter-input" placeholder="ค้นหาความคิดเห็น หรือชื่อผู้ใช้..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="filter-dropdown-group">
                             <select className="filter-select" value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
                                <option value="ทั้งหมด">คะแนนทั้งหมด</option>
                                <option value="5">5 ดาว</option>
                                <option value="4">4 ดาว</option>
                                <option value="3">3 ดาว</option>
                                <option value="2">2 ดาว</option>
                                <option value="1">1 ดาว</option>
                            </select>
                            <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="dateDesc">วันที่ (ใหม่ไปเก่า)</option>
                                <option value="dateAsc">วันที่ (เก่าไปใหม่)</option>
                                <option value="ratingDesc">คะแนน (สูงไปต่ำ)</option>
                                <option value="ratingAsc">คะแนน (ต่ำไปสูง)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="feedback-table-container">
                        <table className="feedback-table">
                            {/* ✨ นำ <thead> กลับมาเพื่อให้ตารางมีโครงสร้างที่ถูกต้อง ✨ */}
                            <thead>
                                <tr>
                                    <th>ผู้ใช้งาน</th>
                                    <th>วันที่</th>
                                    <th>คะแนน</th>
                                    <th>ความคิดเห็น</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableContent()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Feedback;
