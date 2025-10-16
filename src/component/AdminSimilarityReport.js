import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/AdminSimilarityReport.css'; // ตรวจสอบให้แน่ใจว่า path ไปยังไฟล์ CSS ถูกต้อง

// --- ไอคอน ---
const SearchIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon-svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> );

// --- คอมโพเนนท์หลัก ---
const AdminSimilarityReport = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('percentDesc');

    const handleLogout = (e) => {
      e.preventDefault();
      sessionStorage.removeItem('auth_token');
      navigate('/login');
    }

    useEffect(() => {
        const fetchReportData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:5000/api/similarity-report');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setResults(data);
            } catch (err) {
                console.error("Failed to fetch similarity report:", err);
                setError("ไม่สามารถดึงข้อมูลจากเซิร์ฟเวอร์ได้");
            } finally {
                setLoading(false);
            }
        };
        fetchReportData();
    }, []);

    const filteredAndSortedResults = useMemo(() => {
        let processedResults = [...results];
        if (searchTerm) {
            processedResults = processedResults.filter(item =>
                item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.celebrityName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // ✨ 1. แก้ไขส่วนจัดเรียง: แปลงเป็นตัวเลขก่อนเปรียบเทียบ ✨
        switch (sortBy) {
            case 'percentDesc': processedResults.sort((a, b) => parseFloat(b.similarityPercent) - parseFloat(a.similarityPercent)); break;
            case 'percentAsc': processedResults.sort((a, b) => parseFloat(a.similarityPercent) - parseFloat(b.similarityPercent)); break;
            case 'dateDesc': processedResults.sort((a, b) => new Date(b.similarityDate) - new Date(a.similarityDate)); break;
            case 'dateAsc': processedResults.sort((a, b) => new Date(a.similarityDate) - new Date(b.similarityDate)); break;
            default: break;
        }
        return processedResults;
    }, [results, searchTerm, sortBy]);
    
    const renderTableContent = () => {
        if (loading) return <div className="status-text">กำลังโหลดข้อมูล...</div>;
        if (error) return <div className="status-text error-text">{error}</div>;
        if (filteredAndSortedResults.length === 0) return <div className="status-text">ไม่พบข้อมูลที่ตรงกัน</div>;
        
        return (
            <div className="table-container">
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>ID</th><th>ชื่อผู้ใช้</th><th>ชื่อดาราที่คล้าย</th><th>ความคล้าย (%)</th><th>วันที่เปรียบเทียบ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedResults.map(item => (
                            <tr key={item.similarity_ID}>
                                <td>{item.similarity_ID}</td>
                                <td>{item.username}</td>
                                <td>{item.celebrityName}</td>
                                <td>
                                    <div className="progress-bar-container">
                                        <div className="progress-bar-track">
                                            <div 
                                                className="progress-bar-fill" 
                                                style={{ width: `${item.similarityPercent}%` }}
                                            ></div>
                                        </div>
                                        {/* ✨ 2. แก้ไขส่วนแสดงผล: แปลงเป็นตัวเลขก่อนใช้ .toFixed() ✨ */}
                                        {/* ใช้ || 0 เพื่อป้องกัน error หากข้อมูลเป็นค่าว่าง */}
                                        <span>{(parseFloat(item.similarityPercent) || 0).toFixed(2)}</span>
                                    </div>
                                </td>
                                <td>
                                    {new Date(item.similarityDate).toLocaleDateString('th-TH', {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="similarity-report-page-container">
            <header className="similarity-report-header">
                <div className="similarity-report-logo">Cosmetic Admin Panel</div>
                <nav className="similarity-report-nav">
                    <NavLink to="/dashboard">ภาพรวม</NavLink>
                    <NavLink to="/data-manager">จัดการข้อมูล</NavLink>
                    <NavLink to="/feedback">ข้อเสนอแนะ</NavLink>
                    <NavLink to="/similarity">ผลการเทียบใบหน้า</NavLink>
                    <a href="#" onClick={handleLogout}>ออกจากระบบ</a>
                </nav>
            </header>
            <main className="similarity-report-main-content">
                <div className="similarity-report-container">
                    <div className="similarity-report-card-header">
                        <h1>รายงานผลการเปรียบเทียบใบหน้า</h1>
                        <p>แสดงผลลัพธ์ความคล้ายคลึงระหว่างใบหน้าผู้ใช้และดารา</p>
                    </div>
                    <div className="similarity-report-controls-bar">
                        <div className="similarity-report-control-group">
                            <span className="similarity-report-search-icon"><SearchIcon /></span>
                            <input type="text" placeholder="ค้นหาชื่อผู้ใช้หรือดารา..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="similarity-report-search-input"/>
                        </div>
                        <div className="similarity-report-sort-wrapper">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="similarity-report-sort-select">
                                <option value="percentDesc">% ความคล้าย: สูงไปต่ำ</option>
                                <option value="percentAsc">% ความคล้าย: ต่ำไปสูง</option>
                                <option value="dateDesc">วันที่: ใหม่ไปเก่า</option>
                                <option value="dateAsc">วันที่: เก่าไปใหม่</option>
                            </select>
                        </div>
                    </div>
                    {renderTableContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminSimilarityReport;