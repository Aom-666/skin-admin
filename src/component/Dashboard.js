import React, { useState, useEffect } from 'react'; // ลบ useRef ออก
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';

// --- ส่วนจัดการ Library ---
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserCheck, faDna, faUsers, faCheckCircle, faTimesCircle, faPalette,
    faChartLine, faChartPie, faHistory, faDownload,
    faBox, faBolt, faStar, faClock, faPercent
} from '@fortawesome/free-solid-svg-icons';

// ลงทะเบียน components ที่จำเป็นสำหรับ Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

// --- Component สำหรับการ์ดสถิติ ---
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

// --- Component หลักของหน้า Dashboard ---
const Dashboard = () => {
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(5);
    const navigate = useNavigate();
    
    const handleLogout = (e) => {
      e.preventDefault();

      console.log("กำลังออกจากระบบ...");
      localStorage.removeItem('auth_token');
      navigate('/login');

    }
    // --- ลบตัวแปร ref ที่ไม่ใช้ออกแล้ว ---

    // --- ข้อมูลตัวอย่างสำหรับทุกหน้า ---
    const dummyHistoryData = {
        1: [
            { id: 1, time: '10:55 น.', activity: 'เปรียบเทียบใบหน้า (User-108)', status: 'matched', operator: 'Admin' },
            { id: 2, time: '10:52 น.', activity: 'แก้ไขข้อมูลสินค้า #5034', status: 'edited', operator: 'Admin' },
            { id: 3, time: '10:49 น.', activity: 'เปรียบเทียบใบหน้า (User-301)', status: 'mismatched', operator: 'System' },
            { id: 4, time: '10:45 น.', activity: "เพิ่มสินค้าใหม่ 'Lipstick #04'", status: 'added', operator: 'Admin' },
        ],
        2: [
            { id: 5, time: '10:40 น.', activity: 'ลบสินค้า #2011', status: 'mismatched', operator: 'Admin' },
            { id: 6, time: '10:35 น.', activity: 'เปรียบเทียบใบหน้า (User-412)', status: 'matched', operator: 'System' },
            { id: 7, time: '10:30 น.', activity: 'อัปเดตสต็อกสินค้า', status: 'edited', operator: 'Admin' },
        ],
    };

    // --- แก้ไข useEffect ให้เหลือแค่การตั้งค่าข้อมูล ---
    useEffect(() => {
        setHistory(dummyHistoryData[currentPage] || []);
    }, [currentPage]);

    // Data for Charts (ข้อมูลกราฟยังคงเดิม)
    const lineChartData = {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
        datasets: [
            { label: 'Warm Ivory', data: [120, 150, 130, 180, 210, 240, 220], borderColor: '#3498db', backgroundColor: 'rgba(52, 152, 219, 0.1)', fill: true, tension: 0.4 },
            { label: 'Natural Beige', data: [80, 90, 110, 100, 130, 150, 140], borderColor: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.1)', fill: true, tension: 0.4 },
        ],
    };
    const doughnutChartData = {
        labels: ['Warm Ivory', 'Natural Beige', 'Golden Tan', 'Cool Porcelain', 'Other'],
        datasets: [{ data: [45, 25, 15, 10, 5], backgroundColor: ['#f1c40f', '#e67e22', '#d35400', '#f39c12', '#bdc3c7'], borderColor: '#ffffff', borderWidth: 4 }],
    };
    const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true } } } };

    return (
        <div className="cosmetic-dashboard">
            <header className="main-header">
                <div className="logo">Cosmetic Admin Panel</div>
                <nav className="main-nav">
                    <NavLink to="/dashboard">ภาพรวม</NavLink>
                    <NavLink to="/products">จัดการสินค้า</NavLink>
                    <NavLink to="/feedback">ข้อเสนอแนะ</NavLink>
                    <a href="#" onClick={handleLogout}>ออกจากระบบ</a>
                </nav>
            </header>

            <main className="main-content">
                <section className="card stats-overview-section">
                    <h1 className="content-title">สถิติภาพรวม</h1>
                    <div className="stats-grid">
                        <StatCard icon={faBox} label="สินค้าทั้งหมด" value="250" iconColor="#D97706" iconBgColor="#FEF3C7" />
                        <StatCard icon={faUsers} label="ผู้ใช้งานทั้งหมด" value="1,200" iconColor="#4B5563" iconBgColor="#E5E7EB" />
                        <StatCard icon={faBolt} label="ผู้ใช้งานวันนี้" value="350" iconColor="#6D28D9" iconBgColor="#EDE9FE" />
                        <StatCard icon={faStar} label="หมวดหมู่ยอดนิยม" value="Makeup" iconColor="#059669" iconBgColor="#D1FAE5" />
                        <StatCard icon={faClock} label="เวลาใช้งานเฉลี่ย" value="12 min" iconColor="#DB2777" iconBgColor="#FCE7F3" />
                        <StatCard icon={faPercent} label="อัตราการแปลง" value="5.2%" iconColor="#2563EB" iconBgColor="#DBEAFE" />
                    </div>
                </section>

                <div className="analytics-grid">
                    <section className="card face-comparison-card">
                        <div className="card-header"><h2><FontAwesomeIcon icon={faUserCheck} /> ผลการเปรียบเทียบใบหน้า</h2></div>
                        <div className="comparison-body">
                            <div className="face-box"><img src="https://i.pravatar.cc/150?u=person1" alt="Original Face" /><label>ภาพต้นฉบับ</label></div>
                            <div className="match-score"><span>94.5%</span><p>Match Score</p></div>
                            <div className="face-box"><img src="https://i.pravatar.cc/150?u=person2" alt="Verified Face" /><label>ภาพที่ตรวจสอบ</label></div>
                        </div>
                    </section>

                    <section className="card doughnut-chart-card">
                        <div className="card-header"><h2><FontAwesomeIcon icon={faChartPie} /> สัดส่วนโทนสีผิว</h2></div>
                        <div className="chart-container"><Doughnut data={doughnutChartData} options={{ ...chartOptions, plugins: { legend: { position: 'right' } } }} /></div>
                    </section>

                    <section className="card line-chart-card">
                        <div className="card-header"><h2><FontAwesomeIcon icon={faChartLine} /> แนวโน้มโทนสีผิว</h2></div>
                        <div className="chart-container"><Line data={lineChartData} options={chartOptions} /></div>
                    </section>

                    {/* --- เอา ref ออกจาก section นี้แล้ว --- */}
                    <section className="card recent-activity-card">
                        <div className="card-header"><h2><FontAwesomeIcon icon={faHistory} /> กิจกรรมล่าสุด</h2></div>
                        <div className="activity-table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>เวลา</th>
                                        <th>กิจกรรม</th>
                                        <th>สถานะ</th>
                                        <th>ผู้ดำเนินการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((event) => (
                                        <tr key={event.id}>
                                            <td>{event.time}</td>
                                            <td>{event.activity}</td>
                                            <td><span className={`status-pill ${event.status}`}>{event.status === 'matched' ? 'สำเร็จ' : event.status === 'edited' ? 'แก้ไข' : event.status === 'mismatched' ? 'ไม่สำเร็จ' : 'เพิ่มใหม่'}</span></td>
                                            <td>{event.operator}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="pagination-controls">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                ก่อนหน้า
                            </button>
                            <span>
                                หน้า {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                ถัดไป
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;