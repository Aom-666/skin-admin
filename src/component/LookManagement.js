import { useNavigate, NavLink } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import LookForm from './LookForm';
import '../css/ProductManagement.css'; // ใช้ CSS เดิมได้เลย

function LookManagement() {
  const navigate = useNavigate();
  const [looks, setLooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLook, setCurrentLook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- ฟังก์ชันสำหรับดึงข้อมูลจาก API ---
  const fetchLooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/looks');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setLooks(data);
    } catch (err) {
      console.error("Failed to fetch looks:", err);
      setError("ไม่สามารถโหลดข้อมูลลุคได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLooks();
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('auth_token');
    navigate('/login');
  }

  const handleOpenAddModal = () => {
    setCurrentLook(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (look) => {
    setCurrentLook(look);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentLook(null);
  };

  const handleSaveLook = async (lookData) => {
    const url = currentLook
      ? `http://localhost:5000/api/looks/${currentLook.LookID}`
      : 'http://localhost:5000/api/looks';

    const method = currentLook ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lookData),
      });
      if (!response.ok) throw new Error('Failed to save the look.');

      handleCloseModal();
      fetchLooks(); // โหลดข้อมูลใหม่หลังบันทึกสำเร็จ
    } catch (err) {
      console.error("Error saving look:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleDeleteLook = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่ต้องการลบลุคนี้?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/looks/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete the look.');
        fetchLooks(); // โหลดข้อมูลใหม่หลังลบสำเร็จ
      } catch (err) {
        console.error("Error deleting look:", err);
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    }
  };

  const filteredLooks = looks.filter(look =>
    look.lookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    look.lookCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    if (loading) return <p className="loading-text">กำลังโหลดข้อมูล...</p>;
    if (error) return <p className="error-text">{error}</p>;
    return (
      <div className="product-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>ชื่อลุค (lookName)</th>
              <th>หมวดหมู่ (lookCategory)</th>
              <th>คำอธิบาย (description)</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredLooks.map(look => (
              <tr key={look.LookID}>
                <td>{look.LookID}</td>
                <td>{look.lookName}</td>
                <td>{look.lookCategory}</td>
                <td className="description-cell">{look.description}</td>
                <td className="actions">
                  <button className="edit-button" onClick={() => handleOpenEditModal(look)}>แก้ไข</button>
                  <button className="delete-button" onClick={() => handleDeleteLook(look.LookID)}>ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Cosmetic Admin Panel</h1>
        <nav className="admin-nav">
          <NavLink to="/dashboard">ภาพรวม</NavLink>
          <NavLink to="/product">จัดการสินค้า</NavLink>
          <NavLink to="/lookmanage">จัดการลุคการแต่งหน้า</NavLink>
          <NavLink to="/feedback">ข้อเสนอแนะ</NavLink>
          <NavLink to="/similarity">ผลการเทียบใบหน้า</NavLink>
          <a href="#" onClick={handleLogout}>ออกจากระบบ</a>
        </nav>
      </header>

      <main className="admin-main">
        <section className="product-management-section">
          <h2>จัดการลุค (Makeup Looks)</h2>
          <div className="action-bar">
            <button className="add-button" onClick={handleOpenAddModal}>+ เพิ่มลุคใหม่</button>
            <input
              type="text"
              className="search-input"
              placeholder="ค้นหาชื่อลุค หรือหมวดหมู่..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {renderContent()}
        </section>

        {isModalOpen && (
          <LookForm
            look={currentLook}
            onClose={handleCloseModal}
            onSave={handleSaveLook}
          />
        )}
      </main>
    </div>
  );
}

export default LookManagement;