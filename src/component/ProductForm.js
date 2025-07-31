import React, { useState, useEffect } from 'react';
// ตรวจสอบว่าคุณ import ไฟล์ CSS ถูกต้องแล้ว
import '../css/ProductManagement.css';

function ProductForm({ product, onClose, onSave }) {
  // State สำหรับฟิลด์ที่มีอยู่แล้ว
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState(''); // เช่น Skincare, Makeup
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // State ใหม่สำหรับข้อมูลที่ AI ต้องการ
  const [subCategory, setSubCategory] = useState(''); // หมวดหมู่ย่อย เช่น รองพื้น, ลิปสติก, อายแชโดว์
  const [productTone, setProductTone] = useState(''); // โทนสีหลักของผลิตภัณฑ์ เช่น Warm, Cool, Neutral
  const [shadeName, setShadeName] = useState(''); // ชื่อเฉดสี เช่น #N03N Natural Petal
  const [colorFamily, setColorFamily] = useState(''); // ตระกูลสี (สำหรับลิปสติก/บลัช) เช่น Pink, Red, Orange, Nude
  const [finishType, setFinishType] = useState(''); // ประเภทของเนื้อสัมผัส/ฟินิช เช่น Matte, Dewy, Satin
  const [recommendedStyles, setRecommendedStyles] = useState([]); // สไตล์ที่แนะนำ (เก็บเป็น Array)

  useEffect(() => {
    if (product) {
      // โหลดข้อมูลสินค้าเดิมเข้าสู่ state เมื่อมีการแก้ไข
      setName(product.name || '');
      setBrand(product.brand || '');
      setCategory(product.category || '');
      setPrice(product.price || '');
      setDescription(product.description || '');
      setImagePreview(product.image || ''); // สมมติว่า product.image คือ URL ของรูปภาพ
      setImageFile(null); // ไม่ต้องโหลดไฟล์ภาพเดิม

      // โหลดข้อมูลใหม่สำหรับ AI
      setSubCategory(product.subCategory || '');
      setProductTone(product.productTone || '');
      setShadeName(product.shadeName || '');
      setColorFamily(product.colorFamily || '');
      setFinishType(product.finishType || '');
      setRecommendedStyles(product.recommendedStyles || []);
    }
  }, [product]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview('');
    }
  };

  const handleStyleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setRecommendedStyles(prev => [...prev, value]);
    } else {
      setRecommendedStyles(prev => prev.filter(style => style !== value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      // id จะถูกกำหนดใน ProductManagement
      name,
      brand,
      category,
      price: parseFloat(price), // แปลงเป็นตัวเลข
      stock: parseInt(stock, 10), // แปลงเป็นตัวเลข
      description,
      image: imagePreview, // ใช้ base64 string หรือ URL ที่อัปโหลดแล้ว

      // ข้อมูลสำหรับ AI
      subCategory,
      productTone,
      shadeName,
      colorFamily,
      finishType,
      recommendedStyles,
    };
    onSave(newProduct);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{product ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">ชื่อสินค้า:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="brand">แบรนด์:</label>
            <input
              type="text"
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">ประเภท:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">-- เลือกประเภท --</option>
              <option value="Skincare">Skincare</option>
              <option value="Makeup">Makeup</option>
              {/* เพิ่มประเภทอื่นๆ ที่มี */}
            </select>
          </div>

          {/* ฟิลด์ใหม่: หมวดหมู่ย่อย (แสดงเมื่อเลือก Makeup) */}
          {category === 'Makeup' && (
            <div className="form-group">
              <label htmlFor="subCategory">หมวดหมู่ย่อย (Makeup):</label>
              <select
                id="subCategory"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                required={category === 'Makeup'} // บังคับเลือกเมื่อเป็น Makeup
              >
                <option value="">-- เลือกหมวดหมู่ย่อย --</option>
                <option value="Foundation">รองพื้น</option>
                <option value="Lipstick">ลิปสติก</option>
                <option value="Blush">บลัชออน</option>
                <option value="Eyeshadow">อายแชโดว์</option>
                <option value="Eyebrow">ดินสอเขียนคิ้ว</option> {/* ตัวอย่างจากสินค้าในรูป */}
                {/* เพิ่มหมวดหมู่ย่อยอื่นๆ */}
              </select>
            </div>
          )}

          {/* ฟิลด์ใหม่: โทนสีของผลิตภัณฑ์ (สำหรับ Makeup) */}
          {category === 'Makeup' && (
            <div className="form-group">
              <label htmlFor="productTone">โทนสีหลัก:</label>
              <select
                id="productTone"
                value={productTone}
                onChange={(e) => setProductTone(e.target.value)}
                required={category === 'Makeup'}
              >
                <option value="">-- เลือกโทนสี --</option>
                <option value="Warm">Warm (โทนอุ่น)</option>
                <option value="Cool">Cool (โทนเย็น)</option>
                <option value="Neutral">Neutral (โทนกลาง)</option>
              </select>
            </div>
          )}

          {/* ฟิลด์ใหม่: ชื่อเฉดสี (สำหรับ Makeup) */}
          {category === 'Makeup' && (
            <div className="form-group">
              <label htmlFor="shadeName">ชื่อเฉดสี:</label>
              <input
                type="text"
                id="shadeName"
                value={shadeName}
                onChange={(e) => setShadeName(e.target.value)}
                placeholder="เช่น #03N Natural Petal, Dark Brown" // ตัวอย่างจากสินค้าในรูป
                required={category === 'Makeup'}
              />
            </div>
          )}

          {/* ฟิลด์ใหม่: ตระกูลสี (สำหรับลิปสติก, บลัชออน - ถ้าต้องการแยกย่อย) */}
          {(subCategory === 'Lipstick' || subCategory === 'Blush' || subCategory === 'Eyeshadow') && (
            <div className="form-group">
              <label htmlFor="colorFamily">ตระกูลสี:</label>
              <select
                id="colorFamily"
                value={colorFamily}
                onChange={(e) => setColorFamily(e.target.value)}
                required
              >
                <option value="">-- เลือกตระกูลสี --</option>
                <option value="Pink">ชมพู</option>
                <option value="Red">แดง</option>
                <option value="Orange">ส้ม</option>
                <option value="Coral">ส้มอมชมพู</option>
                <option value="Nude">นู้ด</option>
                <option value="Brown">น้ำตาล</option>
                <option value="Plum">ม่วงพลัม</option>
                {/* เพิ่มตัวเลือกอื่นๆ */}
              </select>
            </div>
          )}

          {/* ฟิลด์ใหม่: ประเภทเนื้อสัมผัส/ฟินิช (สำหรับ Makeup) */}
          {category === 'Makeup' && (
            <div className="form-group">
              <label htmlFor="finishType">เนื้อสัมผัส/ฟินิช:</label>
              <select
                id="finishType"
                value={finishType}
                onChange={(e) => setFinishType(e.target.value)}
              >
                <option value="">-- เลือกฟินิช --</option>
                <option value="Matte">Matte</option>
                <option value="Satin">Satin</option>
                <option value="Dewy">Dewy / Glowy</option>
                <option value="Glitter">Glitter</option>
                {/* เพิ่มตัวเลือกอื่นๆ */}
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="price">ราคา:</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">คำอธิบาย:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

           {/* ฟิลด์ใหม่: สไตล์การแต่งหน้าที่แนะนำ (Checkbox Group) */}
          <div className="form-group">
            <label>สไตล์การแต่งหน้าที่แนะนำ:</label>
            <div className="checkbox-group"> {/* <<-- เพิ่ม div ใหม่ครอบ checkbox แต่ละตัว */}
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="styleNatural"
                  value="Natural Look"
                  checked={recommendedStyles.includes("Natural Look")}
                  onChange={handleStyleChange}
                />
                <label htmlFor="styleNatural">Natural Look</label> {/* <<-- ย้าย label ให้อยู่หลัง input */}
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="styleEveryday"
                  value="Everyday Look"
                  checked={recommendedStyles.includes("Everyday Look")}
                  onChange={handleStyleChange}
                />
                <label htmlFor="styleEveryday">Everyday Look</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="styleKorean"
                  value="Korean Style"
                  checked={recommendedStyles.includes("Korean Style")}
                  onChange={handleStyleChange}
                />
                <label htmlFor="styleKorean">Korean Style</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="styleGlam"
                  value="Glamorous Look"
                  checked={recommendedStyles.includes("Glamorous Look")}
                  onChange={handleStyleChange}
                />
                <label htmlFor="styleGlam">Glamorous Look</label>
              </div>
              {/* เพิ่มสไตล์อื่นๆ ตามต้องการ */}
            </div> {/* <<-- ปิด div.checkbox-group */}
          </div>


          <div className="form-group">
            <label htmlFor="image">รูปภาพสินค้า:</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Product Preview" className="image-preview" />
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="save-button">บันทึก</button>
            <button type="button" className="cancel-button" onClick={onClose}>ยกเลิก</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;