import React, { useState, useEffect } from 'react';

function LookForm({ look, onClose, onSave }) {
  const [formData, setFormData] = useState({
    lookName: '',
    lookCategory: 'Everyday Looks',
    description: '',
  });

  useEffect(() => {
    if (look) {
      setFormData({
        lookName: look.lookName || '',
        lookCategory: look.lookCategory || 'Everyday Looks',
        description: look.description || '',
      });
    }
  }, [look]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // ✨ แก้ไข className ทั้งหมดในนี้ให้ตรงกับ CSS ของคุณ ✨
  return (
    <div className="modal-overlay"> {/* <<-- แก้จาก modal-backdrop เป็น modal-overlay */}
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          {/* ใช้ h3 ตามที่ CSS กำหนด */}
          <h3>{look ? 'แก้ไขลุค' : 'เพิ่มลุคใหม่'}</h3>

          <div className="form-group">
            <label>ชื่อลุค (lookName)</label>
            <input type="text" name="lookName" value={formData.lookName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>หมวดหมู่ (lookCategory)</label>
            <select name="lookCategory" value={formData.lookCategory} onChange={handleChange} required>
              <option value="Everyday Looks">Everyday Looks</option>
              <option value="Cultural Styles">Cultural Styles</option>
              <option value="Party Looks">Party Looks</option>
              <option value="Thematic Looks">Thematic Looks</option>
              <option value="Seasonal Looks">Seasonal Looks</option>
              <option value="Special Occasion">Special Occasion</option>
              <option value="Alternative Styles">Alternative Styles</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>คำอธิบาย (description)</label>
            <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
          </div>

          <div className="form-actions"> {/* <<-- แก้จาก modal-actions เป็น form-actions */}
            <button type="button" className="cancel-button" onClick={onClose}>ยกเลิก</button>
            <button type="submit" className="save-button">บันทึก</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LookForm;