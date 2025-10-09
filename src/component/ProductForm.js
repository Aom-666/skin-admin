import React, { useState, useEffect } from 'react';
import { parse, formatRgb, converter } from 'culori';

function ProductForm({ product, onClose, onSave }) {
  // --- State สำหรับจัดการข้อมูลในฟอร์มทั้งหมด ---
  const [formData, setFormData] = useState({
    Name: '',
    ShadeName: '',
    Type: '',
    Description: '',
    Price: '',
    ImageURL: '',
    ProductLink: '',
    BrandID: '',
    suitableSkinTone: '',
    suitableLookType: [], // State สำหรับ Checkbox
    HexCode: '',
    RGBCode: '',
    Lab_L: '',
    Lab_a: '',
    Lab_b: ''
  });
  const [brands, setBrands] = useState([]);
  const [allLooks, setAllLooks] = useState([]);

  // --- useEffect: ดึงข้อมูลตั้งต้น (แบรนด์ และ ลุค) ---
  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            const [brandsRes, looksRes] = await Promise.all([
                fetch('http://localhost:5000/api/brands'),
                fetch('http://localhost:5000/api/looks')
            ]);
            const brandsData = await brandsRes.json();
            const looksData = await looksRes.json();
            setBrands(brandsData);
            setAllLooks(looksData);
        } catch (error) {
            console.error("Failed to fetch initial data for form:", error);
        }
    };
    fetchInitialData();
  }, []);

  // --- useEffect: ตั้งค่าข้อมูลเมื่อเป็นการ "แก้ไข" ---
  useEffect(() => {
    if (product) {
      const lookTypeIDs = product.suitableLookType 
        ? product.suitableLookType.split(',').map(id => parseInt(id.trim(), 10))
        : [];

      setFormData({
        Name: product.Name || '',
        ShadeName: product.ShadeName || '',
        Type: product.Type || '',
        Description: product.Description || '',
        Price: product.Price || '',
        ImageURL: product.ImageURL || '',
        ProductLink: product.ProductLink || '',
        BrandID: product.BrandID || '',
        suitableSkinTone: product.suitableSkinTone || '',
        HexCode: product.HexCode || '',
        RGBCode: product.RGBCode || '',
        Lab_L: product.Lab_L || '',
        Lab_a: product.Lab_a || '',
        Lab_b: product.Lab_b || '',
        suitableLookType: lookTypeIDs
      });
    }
  }, [product]);

  // --- useEffect: คำนวณสีอัตโนมัติเมื่อ HexCode เปลี่ยน ---
  useEffect(() => {
    if (formData.HexCode && formData.HexCode.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      const color = parse(formData.HexCode);
      if (color) {
        const rgbString = formatRgb(color);
        const rgbValues = rgbString.match(/\d+/g);
        const toLab = converter('lab');
        const lab = toLab(color);
        setFormData(prev => ({
          ...prev,
          RGBCode: rgbValues ? rgbValues.join(', ') : '',
          Lab_L: lab.l.toFixed(2),
          Lab_a: lab.a.toFixed(2),
          Lab_b: lab.b.toFixed(2)
        }));
      }
    } else {
        setFormData(prev => ({
          ...prev,
          RGBCode: '', Lab_L: '', Lab_a: '', Lab_b: ''
        }));
    }
  }, [formData.HexCode]);

  // --- Handler Functions ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLookTypeChange = (lookId) => {
    setFormData(prev => {
        const currentLookTypes = prev.suitableLookType;
        if (currentLookTypes.includes(lookId)) {
            return { ...prev, suitableLookType: currentLookTypes.filter(id => id !== lookId) };
        } else {
            return { ...prev, suitableLookType: [...currentLookTypes, lookId] };
        }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <h3>{product ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h3>

          {/* === ส่วนข้อมูลสินค้าหลัก === */}
          <div className="form-group">
            <label>ชื่อสินค้า (Name)</label>
            <input type="text" name="Name" value={formData.Name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>แบรนด์ (Brand)</label>
            <select name="BrandID" value={formData.BrandID} onChange={handleChange} required>
                <option value="">-- กรุณาเลือกแบรนด์ --</option>
                {brands.map(brand => (
                    <option key={brand.BrandID} value={brand.BrandID}>{brand.BrandName}</option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>ประเภท (Type)</label>
            <input type="text" name="Type" value={formData.Type} onChange={handleChange} placeholder="เช่น Foundation, Lipstick, Skincare" required />
          </div>

          <div className="form-group">
            <label>ชื่อเฉดสี (Shade Name)</label>
            <input type="text" name="ShadeName" value={formData.ShadeName} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label>ราคา (Price)</label>
            <input type="number" name="Price" value={formData.Price} onChange={handleChange} step="0.01" placeholder="เช่น 1800.00" />
          </div>

          <div className="form-group">
            <label>โทนสีผิวที่แนะนำ (Suitable Skin Tone)</label>
            <input type="text" name="suitableSkinTone" value={formData.suitableSkinTone} onChange={handleChange} placeholder="เช่น Warm, Cool, Neutral" />
          </div>

          <div className="form-group">
            <label>URL รูปภาพ (Image URL)</label>
            <input type="text" name="ImageURL" value={formData.ImageURL} onChange={handleChange} placeholder="เช่น http://localhost:5000/images/product.jpg" />
          </div>

          <div className="form-group">
            <label>ลิงก์สินค้า (Product Link)</label>
            <input type="text" name="ProductLink" value={formData.ProductLink} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>คำอธิบาย (Description)</label>
            <textarea name="Description" value={formData.Description} onChange={handleChange}></textarea>
          </div>

          {/* === ส่วนเลือกลุค (Checkboxes) === */}
          <div className="form-group">
            <label>สไตล์ลุคที่แนะนำ (Suitable Look Type)</label>
            <div className="checkbox-group">
                {allLooks.map(look => (
                    <div key={look.LookID} className="checkbox-item">
                        <input 
                            type="checkbox"
                            id={`look-${look.LookID}`}
                            value={look.LookID}
                            checked={formData.suitableLookType.includes(look.LookID)}
                            onChange={() => handleLookTypeChange(look.LookID)}
                        />
                        <label htmlFor={`look-${look.LookID}`}>{look.lookName}</label>
                    </div>
                ))}
            </div>
          </div>

          {/* === ส่วนข้อมูลสี (สำหรับ AI) === */}
          <hr style={{margin: '2rem 0', border: 'none', borderTop: '1px solid #eee'}} />
          <h4 style={{marginTop: 0, marginBottom: '1.5rem'}}>ข้อมูลสี (สำหรับ AI)</h4>
          
          <div className="form-group">
            <label>Hex Code (กรอกค่านี้ ระบบจะคำนวณที่เหลือให้)</label>
            <input type="text" name="HexCode" value={formData.HexCode} onChange={handleChange} placeholder="#RRGGBB" />
          </div>

          <div className="form-group">
            <label>RGB Code (คำนวณอัตโนมัติ)</label>
            <input type="text" name="RGBCode" value={formData.RGBCode} readOnly />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
                <label>CIELAB L*</label>
                <input type="text" name="Lab_L" value={formData.Lab_L} readOnly />
            </div>
            <div className="form-group">
                <label>CIELAB a*</label>
                <input type="text" name="Lab_a" value={formData.Lab_a} readOnly />
            </div>
            <div className="form-group">
                <label>CIELAB b*</label>
                <input type="text" name="Lab_b" value={formData.Lab_b} readOnly />
            </div>
          </div>

          {/* === ปุ่ม Actions === */}
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>ยกเลิก</button>
            <button type="submit" className="save-button">บันทึก</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;