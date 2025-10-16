import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';

// --- ส่วนจัดการ Library ---
// ✨ 1. เพิ่ม BarElement สำหรับกราฟแท่ง
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
// ✨ 2. เปลี่ยน Line เป็น Bar
import { Doughnut, Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers, faPalette, faBoxOpen, faCommentDots, faDna,
    faHistory, faTrophy
} from '@fortawesome/free-solid-svg-icons';

// ✨ 3. ลงทะเบียน BarElement
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// --- Component สำหรับการ์ดสถิติ (เหมือนเดิม) ---
const StatCard = ({ icon, label, value, iconColor, iconBgColor }) => {
    return (
        <div className="stat-card">
            <div className="card-icon" style={{ color: iconColor, backgroundColor: iconBgColor }}>
                <FontAwesomeIcon icon={icon} />
            </div>
            <div className="card-info">
                <span className="card-label">{label}</span>
                <span className="card-value">{value}</span>
            </div>
        </div>
    );
};

// --- Component หลักของหน้า Dashboard (แก้ไขใหม่) ---
const Dashboard = () => {
    const navigate = useNavigate();

    // --- State สำหรับเก็บข้อมูลจาก API ---
    const [stats, setStats] = useState({ users: 0, cosmetics: 0, looks: 0, feedbacks: 0 });
    const [skinToneData, setSkinToneData] = useState({ labels: [], datasets: [] });
    const [celebrityData, setCelebrityData] = useState([]);
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const handleLogout = (e) => {
        e.preventDefault();
        sessionStorage.removeItem('auth_token');
        navigate('/login');
    }

    // --- useEffect สำหรับดึงข้อมูลทั้งหมด ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // ✨ 4. ใช้ Promise.all เพื่อดึงข้อมูลพร้อมกันทั้งหมด ทำให้เร็วกว่า
                const [statsRes, skinToneRes, celebrityRes] = await Promise.all([
                    fetch('http://localhost:5000/api/stats/summary'),
                    fetch('http://localhost:5000/api/skintone-summary'),
                    fetch('http://localhost:5000/api/popular-celebrities'),
                ]);

                // 1. แปลงข้อมูลสถิติ
                const statsData = await statsRes.json();
                setStats(statsData);

                // 2. แปลงข้อมูลกราฟสัดส่วนโทนสีผิว
                const skinToneSummary = await skinToneRes.json();
                setSkinToneData({
                    labels: skinToneSummary.map(d => d.SkinTone),
                    datasets: [{
                        data: skinToneSummary.map(d => d.count),
                        backgroundColor: ['#ffc107', '#fd7e14', '#dc3545', '#6f42c1', '#20c997'],
                        borderColor: '#ffffff', borderWidth: 4,
                    }],
                });

                // ✨ เปลี่ยนจากโค้ดเดิมทั้งหมด มาเป็นบรรทัดนี้ ✨
                const popularCelebrities = await celebrityRes.json();
                setCelebrityData(popularCelebrities);

            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูล Dashboard:", error);
            }
        };

        const fetchHistory = async () => {
            try {
                // 4. ดึงข้อมูลกิจกรรมล่าสุด (แยกออกมาเพื่อให้ pagination ทำงานได้)
                const activityRes = await fetch(`http://localhost:5000/api/activity-log?page=${currentPage}&limit=4`);
                const activityData = await activityRes.json();
                setHistory(activityData.logs);
                setTotalPages(activityData.totalPages);
            } catch (error) {
                console.error("Failed to fetch activity log:", error);
            }
        };

        fetchData();
        fetchHistory();
    }, [currentPage]); // Re-fetch เฉพาะ activity log เมื่อเปลี่ยนหน้า

    const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
    const barChartOptions = { ...chartOptions, indexAxis: 'y' }; // ทำให้เป็นกราฟแท่งแนวนอน

    return (
        <div className="cosmetic-dashboard">
            <header className="main-header">
                <div className="logo">Cosmetic Admin Panel</div>
                <nav className="main-nav">
                    <NavLink to="/dashboard">ภาพรวม</NavLink>
                    <NavLink to="/data-manager">จัดการข้อมูล</NavLink>
                    <NavLink to="/feedback">ข้อเสนอแนะ</NavLink>
                    <NavLink to="/similarity">ผลการเทียบใบหน้า</NavLink>
                    <a href="#" onClick={handleLogout}>ออกจากระบบ</a>
                </nav>
            </header>

            <main className="main-content">
                <section className="card stats-overview-section">
                    <h1 className="content-title">สถิติภาพรวม</h1>
                    <div className="stats-grid">
                        {/* ✨ 5. แทนที่ค่า Mockup ด้วย State ✨ */}
                        <StatCard icon={faBoxOpen} label="สินค้าทั้งหมด" value={(stats.cosmetics || 0).toLocaleString()} iconColor="#D97706" iconBgColor="#FEF3C7" />
                        <StatCard icon={faUsers} label="ผู้ใช้งานทั้งหมด" value={(stats.users || 0).toLocaleString()} iconColor="#4B5563" iconBgColor="#E5E7EB" />
                        <StatCard icon={faPalette} label="ลุคการแต่งหน้า" value={(stats.looks || 0).toLocaleString()} iconColor="#059669" iconBgColor="#D1FAE5" />
                        <StatCard icon={faCommentDots} label="Feedback ทั้งหมด" value={(stats.feedbacks || 0).toLocaleString()} iconColor="#DB2777" iconBgColor="#FCE7F3" />
                    </div>
                </section>

                {/* ✨ นี่คือส่วนที่แก้ไขทั้งหมด ✨ */}
                <div className="analytics-grid">

                    {/* --- คอลัมน์ที่ 1: สัดส่วนโทนสีผิว (เหมือนเดิม) --- */}
                    <section className="card doughnut-chart-card">
                        <div className="card-header"><h2><FontAwesomeIcon icon={faDna} /> สัดส่วนโทนสีผิวผู้ใช้</h2></div>
                        <div className="chart-container">
                            <Doughnut data={skinToneData} options={{ ...chartOptions, plugins: { legend: { position: 'right' } } }} />
                        </div>
                    </section>

                    {/* --- คอลัมน์ที่ 2: เปลี่ยนจากกราฟเป็น "ตารางอันดับ" --- */}
                    <section className="card">
                        <div className="card-header"><h2><FontAwesomeIcon icon={faTrophy} /> 5 อันดับดารายอดนิยม</h2></div>
                        <div className="ranking-table-wrapper">
                            <table className="ranking-table">
                                <tbody>
                                    {celebrityData.map((celeb, index) => (
                                        <tr key={celeb.celebrityName}>
                                            <td className="rank-number">{index + 1}</td>
                                            <td className="rank-name">{celeb.celebrityName}</td>
                                            <td className="rank-count">
                                                <strong>{celeb.comparison_count.toLocaleString()}</strong> ครั้ง
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* --- แถวล่าง: กิจกรรมล่าสุด (ขยายเต็ม) (เหมือนเดิม) --- */}
                    <section className="card recent-activity-card">
                        <div className="card-header"><h2><FontAwesomeIcon icon={faHistory} /> กิจกรรมล่าสุด</h2></div>
                        <div className="activity-table-wrapper">
                            <table>
                                <thead>
                                    <tr><th>เวลา</th><th>กิจกรรม</th><th>สถานะ</th><th>ผู้ดำเนินการ</th></tr>
                                </thead>
                                <tbody>
                                    {history.map((log) => (
                                        <tr key={log.log_id}>
                                            <td>{new Date(log.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</td>
                                            <td>{log.description}</td>
                                            <td><span className={`status-pill`}>{log.status}</span></td>
                                            <td>{log.operator_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="pagination-controls">
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>ก่อนหน้า</button>
                            <span>หน้า {currentPage} / {totalPages || 1}</span>
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}>ถัดไป</button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;