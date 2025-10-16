import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// Import ฟอร์มต่างๆ ที่เราต้องใช้
import ProductForm from './ProductForm';
import LookForm from './LookForm';

import '../css/DataManager.css';

const API_BASE_URL = 'http://localhost:5000';

const ProductManagementTab = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const placeholderImage = 'https://placehold.co/100x100/f8f9fa/343a40?text=No+Image';

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/cosmetics`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError("ไม่สามารถโหลดข้อมูลสินค้าได้");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleOpenAddModal = () => { setCurrentProduct(null); setIsModalOpen(true); };
    const handleOpenEditModal = (product) => { setCurrentProduct(product); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setCurrentProduct(null); };

    const handleSaveProduct = async (productData) => {
        const url = currentProduct ? `${API_BASE_URL}/api/cosmetics/${currentProduct.CosmeticID}` : `${API_BASE_URL}/api/cosmetics`;
        const method = currentProduct ? 'PUT' : 'POST';
        try {
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            handleCloseModal();
            fetchProducts();
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ที่ต้องการลบสินค้านี้?')) {
            try {
                await fetch(`${API_BASE_URL}/api/cosmetics/${id}`, { method: 'DELETE' });
                fetchProducts();
            } catch (err) {
                alert("เกิดข้อผิดพลาดในการลบข้อมูล");
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.BrandName && p.BrandName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const renderProductContent = () => {
        if (loading) return <p>กำลังโหลดข้อมูล...</p>;
        if (error) return <p>{error}</p>;
        return (
            <div className="table-container">
                <table>
                    <thead><tr><th>รูปภาพ</th><th>ชื่อสินค้า</th><th>แบรนด์</th><th>ประเภท</th><th>เฉดสี</th><th>ราคา</th><th>การดำเนินการ</th></tr></thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.CosmeticID}>
                                <td><img src={product.ImageURL ? `${API_BASE_URL}${product.ImageURL}` : placeholderImage} alt={product.Name} className="thumbnail" onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}/></td>
                                <td>{product.Name}</td>
                                <td>{product.BrandName || 'N/A'}</td>
                                <td>{product.Type}</td>
                                <td>{product.ShadeName}</td>
                                <td>฿{(parseFloat(product.Price) || 0).toLocaleString()}</td>
                                <td className="actions">
                                    <button className="edit-button" onClick={() => handleOpenEditModal(product)}>แก้ไข</button>
                                    <button className="delete-button" onClick={() => handleDeleteProduct(product.CosmeticID)}>ลบ</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <section className="management-section">
            <div className="action-bar">
                <button className="add-button" onClick={handleOpenAddModal}>+ เพิ่มสินค้าใหม่</button>
                <input type="text" className="search-input" placeholder="ค้นหาสินค้า..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>
            {renderProductContent()}
            {isModalOpen && <ProductForm product={currentProduct} onClose={handleCloseModal} onSave={handleSaveProduct} />}
        </section>
    );
};

const LookManagementTab = () => {
    const [looks, setLooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLook, setCurrentLook] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLooks = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/looks`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setLooks(data);
        } catch (err) {
            setError("ไม่สามารถโหลดข้อมูลลุคได้");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLooks(); }, []);

    const handleOpenAddModal = () => { setCurrentLook(null); setIsModalOpen(true); };
    const handleOpenEditModal = (look) => { setCurrentLook(look); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setCurrentLook(null); };

    const handleSaveLook = async (lookData) => {
        const url = currentLook ? `${API_BASE_URL}/api/looks/${currentLook.LookID}` : `${API_BASE_URL}/api/looks`;
        const method = currentLook ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, { 
                method, 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(lookData) 
            });

            // ✨ ส่วนที่เพิ่มเข้ามา: จัดการ Error จาก API ✨
            if (!response.ok) {
                // ถ้าเป็น Error ชื่อซ้ำ (409 Conflict)
                if (response.status === 409) {
                    const errorData = await response.json();
                    alert(errorData.message); // แสดง alert บอกว่า "ชื่อลุค... มีอยู่แล้ว"
                } else {
                    // Error อื่นๆ
                    throw new Error('Failed to save the look.');
                }
                return; // หยุดการทำงานของฟังก์ชันทันที
            }
            // --- สิ้นสุดส่วนจัดการ Error ---

            handleCloseModal();
            fetchLooks();
        } catch (err) {
            console.error("Error saving look:", err);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    const handleDeleteLook = async (id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ที่ต้องการลบลุคนี้?')) {
            try {
                await fetch(`${API_BASE_URL}/api/looks/${id}`, { method: 'DELETE' });
                fetchLooks();
            } catch (err) { alert("เกิดข้อผิดพลาดในการลบข้อมูล"); }
        }
    };

    const filteredLooks = looks.filter(look =>
        look.lookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        look.lookCategory.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p className="loading-text">กำลังโหลดข้อมูล...</p>;
    if (error) return <p className="error-text">{error}</p>;

    return (
        <section className="management-section">
            <div className="action-bar">
                <button className="add-button" onClick={handleOpenAddModal}>+ เพิ่มลุคใหม่</button>
                <input type="text" className="search-input" placeholder="ค้นหาชื่อลุค หรือหมวดหมู่..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="table-container">
                <table>
                    <thead><tr><th>ID</th><th>ชื่อลุค</th><th>หมวดหมู่</th><th>คำอธิบาย</th><th>การดำเนินการ</th></tr></thead>
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
            {isModalOpen && <LookForm look={currentLook} onClose={handleCloseModal} onSave={handleSaveLook} />}
        </section>
    );
};


// ====================================================================
// ✨ 3. ส่วนจัดการแบรนด์ (โค้ดใหม่) ✨
// ====================================================================
const BrandManagementTab = () => {
    const [brands, setBrands] = useState([]);
    const [newBrandName, setNewBrandName] = useState('');

    const fetchBrands = async () => {
        const response = await fetch(`${API_BASE_URL}/api/brand`);
        const data = await response.json();
        setBrands(data);
    };

    useEffect(() => { fetchBrands(); }, []);

    const handleAddBrand = async (e) => {
        e.preventDefault();
        if (!newBrandName.trim()) return;
        await fetch(`${API_BASE_URL}/api/brand`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ brandName: newBrandName }),
        });
        setNewBrandName('');
        fetchBrands();
    };

    const handleDeleteBrand = async (id) => {
        if (window.confirm('คุณแน่ใจหรือไม่?')) {
            const res = await fetch(`${API_BASE_URL}/api/brand/${id}`, { method: 'DELETE' });
            if (!res.ok) {
                const err = await res.json();
                alert(err.message);
            } else {
                fetchBrands();
            }
        }
    };

    return (
        // ✨ เพิ่ม id="brand-management-tab" เข้าไปที่นี่ ✨
        <section className="management-section" id="brand-management-tab">
            <div className="action-bar">
                 <form onSubmit={handleAddBrand} className="add-form">
                    <button type="submit" className="add-button">+ เพิ่มแบรนด์</button>
                    <input type="text" value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} placeholder="เพิ่มแบรนด์ใหม่..." className="search-input" />
                </form>
            </div>
            <div className="table-container">
                <table>
                    <thead><tr><th>ID</th><th>ชื่อแบรนด์</th><th>วันที่สร้าง</th><th>การดำเนินการ</th></tr></thead>
                    <tbody>
                        {brands.map(brand => (
                            <tr key={brand.brandID}>
                                <td>{brand.brandID}</td>
                                <td>{brand.brandName}</td>
                                <td>{new Date(brand.createdAt).toLocaleDateString('th-TH')}</td>
                                <td className="actions">
                                    <button className="delete-button" onClick={() => handleDeleteBrand(brand.brandID)}>ลบ</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};


// ====================================================================
// ✨ 4. คอมโพเนนท์หลักที่รวมทุกอย่างเข้าด้วยกัน ✨
// ====================================================================
function DataManager() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('products');

    const handleLogout = (e) => {
        e.preventDefault();
        sessionStorage.removeItem('auth_token');
        navigate('/login');
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Cosmetic Admin Panel</h1>
                <nav className="admin-nav">
                    <NavLink to="/dashboard">ภาพรวม</NavLink>
                    <NavLink to="/data-manager">จัดการข้อมูล</NavLink>
                    <NavLink to="/feedback">ข้อเสนอแนะ</NavLink>
                    <NavLink to="/similarity">ผลการเทียบใบหน้า</NavLink>
                    <a href="#" onClick={handleLogout}>ออกจากระบบ</a>
                </nav>
            </header>

            <main className="admin-main">
                <div className="tab-navigation">
                    <button className={`tab-button ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>จัดการสินค้า</button>
                    <button className={`tab-button ${activeTab === 'looks' ? 'active' : ''}`} onClick={() => setActiveTab('looks')}>จัดการลุค</button>
                    <button className={`tab-button ${activeTab === 'brands' ? 'active' : ''}`} onClick={() => setActiveTab('brands')}>จัดการแบรนด์</button>
                </div>

                <div className="tab-content">
                    {activeTab === 'products' && <ProductManagementTab />}
                    {activeTab === 'looks' && <LookManagementTab />}
                    {activeTab === 'brands' && <BrandManagementTab />}
                </div>
            </main>
        </div>
    );
}

export default DataManager;