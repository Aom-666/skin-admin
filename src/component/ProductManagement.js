import { useNavigate, NavLink } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm'; // Import ฟอร์ม
import '../css/ProductManagement.css'; // ใช้ CSS เดิมของคุณ

function ProductManagement() {
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
            const response = await fetch('http://localhost:5000/api/cosmetics');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError("ไม่สามารถโหลดข้อมูลสินค้าได้");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleLogout = (e) => { e.preventDefault(); sessionStorage.removeItem('auth_token'); navigate('/login'); };
    const handleOpenAddModal = () => { setCurrentProduct(null); setIsModalOpen(true); };
    const handleOpenEditModal = (product) => { setCurrentProduct(product); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setCurrentProduct(null); };

    const handleSaveProduct = async (productData) => {
        const url = currentProduct
            ? `http://localhost:5000/api/cosmetics/${currentProduct.CosmeticID}`
            : 'http://localhost:5000/api/cosmetics';
        const method = currentProduct ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            if (!response.ok) throw new Error('Failed to save product.');
            handleCloseModal();
            fetchProducts();
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ที่ต้องการลบสินค้านี้?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/cosmetics/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete product.');
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

    const renderContent = () => {
        if (loading) return <p>กำลังโหลดข้อมูล...</p>;
        if (error) return <p>{error}</p>;
        return (
            <div className="product-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>รูปภาพ</th>
                            <th>ชื่อสินค้า</th>
                            <th>แบรนด์</th>
                            <th>ประเภท</th>
                            <th>เฉดสี</th>
                            <th>ราคา</th>
                            <th>การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.CosmeticID}>
                                <td>
                                    {/* ✨ แก้ไขแท็ก img ที่นี่ ✨ */}
                                    <img
                                        src={product.ImageURL || placeholderImage}
                                        alt={product.Name}
                                        className="product-thumbnail"
                                        // onError จะทำงานเมื่อ src โหลดไม่สำเร็จ
                                        onError={(e) => {
                                            e.target.onerror = null; // ป้องกันการวนลูป error
                                            e.target.src = placeholderImage; // เปลี่ยนไปใช้รูปสำรอง
                                        }}
                                    />
                                </td>
                                <td>{product.Name}</td>
                                <td>{product.BrandName || 'N/A'}</td>
                                <td>{product.Type}</td>
                                <td>{product.ShadeName}</td>
                                <td>฿{(product.Price || 0).toLocaleString()}</td>
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
                    <h2>จัดการสินค้า (Cosmetics)</h2>
                    <div className="action-bar">
                        <button className="add-button" onClick={handleOpenAddModal}>+ เพิ่มสินค้าใหม่</button>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="ค้นหาชื่อสินค้า หรือแบรนด์..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {renderContent()}
                </section>
                {isModalOpen && (
                    <ProductForm
                        product={currentProduct}
                        onClose={handleCloseModal}
                        onSave={handleSaveProduct}
                    />
                )}
            </main>
        </div>
    );
}

export default ProductManagement;