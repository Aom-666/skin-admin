import { useNavigate, Link, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ProductForm from './ProductForm'; // ตรวจสอบเส้นทางให้ถูกต้อง
import '../css/ProductManagement.css'; // ตรวจสอบว่า import CSS ถูกต้องแล้ว

function ProductManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();

    console.log("กำลังออกจากระบบ...");
    localStorage.removeItem('auth_token');
    navigate('/login');

  }

  const [products, setProducts] = useState([
    // ตัวอย่างข้อมูลสินค้าที่มีอยู่เดิม (พร้อมเพิ่มข้อมูลใหม่สำหรับ AI)
    {
      id: 1,
      image: '/images/water_sleeping_mask.jpg', // สมมติว่ามีโฟลเดอร์ images ใน public
      name: 'Water Sleeping Mask',
      brand: 'Laneige',
      category: 'Skincare', // ประเภท
      price: 1200,
      stock: 150,
      description: 'มาสก์หน้าสำหรับกลางคืน ช่วยเติมความชุ่มชื้นให้ผิว',
      // ข้อมูลสำหรับ AI (สำหรับ Skincare อาจไม่มีฟิลด์ Makeup Tone)
      subCategory: '',
      productTone: '',
      shadeName: '',
      colorFamily: '',
      finishType: '',
      recommendedStyles: ['Everyday Look', 'Natural Look'], // แนะนำสไตล์ที่เกี่ยวกับ Skincare
    },
    {
      id: 2,
      image: '/images/midnight_recovery.jpg',
      name: 'Midnight Recovery Concentrate',
      brand: 'Kiehl\'s',
      category: 'Skincare',
      price: 2500,
      stock: 80,
      description: 'เซรั่มบำรุงผิวหน้ายามค่ำคืน',
      subCategory: '',
      productTone: '',
      shadeName: '',
      colorFamily: '',
      finishType: '',
      recommendedStyles: ['Everyday Look', 'Natural Look'],
    },
    {
      id: 3,
      image: '/images/double_wear_foundation.jpg',
      name: 'Double Wear Foundation',
      brand: 'Estee Lauder',
      category: 'Makeup', // ประเภท
      price: 1800,
      stock: 200,
      description: 'รองพื้นติดทนนาน 24 ชั่วโมง',
      // ข้อมูลสำหรับ AI (สำหรับ Makeup)
      subCategory: 'Foundation', // หมวดหมู่ย่อย
      productTone: 'Warm', // โทนสีหลัก
      shadeName: '#N03N Natural Petal', // ชื่อเฉดสี (จากภาพในแอป)
      colorFamily: '', // รองพื้นไม่มีตระกูลสีเหมือนลิปสติก
      finishType: 'Matte', // ฟินิช
      recommendedStyles: ['Everyday Look', 'Glamorous Look'], // สไตล์ที่แนะนำ
    },
    { // ตัวอย่างสินค้าจากภาพแอป: Maybelline New York Superstay Vinyl Ink Longwear Liquid Lipcolor
      id: 4,
      image: '/images/maybelline_lipstick.jpg',
      name: 'Superstay Vinyl Ink Liquid Lipcolor',
      brand: 'Maybelline New York',
      category: 'Makeup',
      price: 150,
      stock: 120,
      description: 'ลิปจิ้มจุ่มติดทน',
      subCategory: 'Lipstick',
      productTone: 'Neutral', // สมมติ
      shadeName: '262 Irresistible', // ชื่อเฉดสี
      colorFamily: 'Nude', // สมมติ
      finishType: 'Vinyl', // หรือ Semi-Gloss
      recommendedStyles: ['Everyday Look', 'Glamorous Look'],
    },
    { // ตัวอย่างสินค้าจากภาพแอป: Etude Drawing Eyebrow #1 Dark Brown
      id: 5,
      image: '/images/etude_eyebrow.jpg',
      name: 'Drawing Eyebrow #1 Dark Brown',
      brand: 'Etude',
      category: 'Makeup',
      price: 107,
      stock: 300,
      description: 'ดินสอเขียนคิ้ว',
      subCategory: 'Eyebrow',
      productTone: 'Neutral', // สมมติ
      shadeName: 'Dark Brown',
      colorFamily: 'Brown',
      finishType: 'Matte',
      recommendedStyles: ['Everyday Look', 'Natural Look'],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenAddModal = () => {
    setCurrentProduct(null); // สำหรับการเพิ่มสินค้าใหม่
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setCurrentProduct(product); // สำหรับการแก้ไขสินค้าเดิม
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleSaveProduct = (productData) => {
    if (currentProduct) {
      // Logic สำหรับแก้ไขสินค้า: อัปเดตข้อมูลทั้งหมด
      setProducts(products.map(p =>
        p.id === currentProduct.id ? { ...p, ...productData } : p
      ));
    } else {
      // Logic สำหรับเพิ่มสินค้าใหม่: เพิ่มข้อมูลทั้งหมด
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      setProducts([...products, { id: newId, ...productData }]);
    }
    handleCloseModal();
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่ต้องการลบสินค้านี้?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.subCategory.toLowerCase().includes(searchTerm.toLowerCase()) // กรองจาก subCategory ด้วย
  );

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

      {/* Main Content */}
      <main className="admin-main">
        <section className="product-management-section">
          <h2>จัดการสินค้า</h2>
          <div className="action-bar">
            <button className="add-button" onClick={handleOpenAddModal}>
              + เพิ่มสินค้าใหม่
            </button>
            <input
              type="text"
              className="search-input"
              placeholder="ค้นหาสินค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Product Table */}
          <div className="product-table-container">
            <table>
              <thead>
                <tr>
                  <th>รูปภาพ</th>
                  <th>ชื่อสินค้า</th>
                  <th>แบรนด์</th>
                  <th>ประเภท</th>
                  <th>หมวดหมู่ย่อย</th> {/* <<-- เพิ่ม column ใหม่ */}
                  <th>โทนสีหลัก</th>    {/* <<-- เพิ่ม column ใหม่ */}
                  <th>เฉดสี</th>        {/* <<-- เพิ่ม column ใหม่ */}
                  <th>ฟินิช</th>       {/* <<-- เพิ่ม column ใหม่ */}
                  <th>สไตล์ที่แนะนำ</th> {/* <<-- เพิ่ม column ใหม่ */}
                  <th>ราคา</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img src={product.image} alt={product.name} className="product-thumbnail" />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.brand}</td>
                    <td>{product.category}</td>
                    <td>{product.subCategory}</td> {/* <<-- แสดงข้อมูล */}
                    <td>{product.productTone}</td> {/* <<-- แสดงข้อมูล */}
                    <td>{product.shadeName}</td>   {/* <<-- แสดงข้อมูล */}
                    <td>{product.finishType}</td>  {/* <<-- แสดงข้อมูล */}
                    <td>{product.recommendedStyles.join(', ')}</td> {/* <<-- แสดง Array เป็น String */}
                    <td>฿{product.price.toLocaleString()}</td>
                    <td className="actions">
                      <button className="edit-button" onClick={() => handleOpenEditModal(product)}>แก้ไข</button>
                      <button className="delete-button" onClick={() => handleDeleteProduct(product.id)}>ลบ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Product Form Modal */}
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