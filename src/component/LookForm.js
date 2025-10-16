import React, { useState, useEffect } from 'react';

const levenshteinDistance = (s1, s2) => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};

function LookForm({ look, onClose, onSave }) {
  const [formData, setFormData] = useState({
    lookName: '',
    lookCategory: 'Everyday Looks',
    description: '',
  });
  const [allLookNames, setAllLookNames] = useState([]);

  // useEffect สำหรับดึงข้อมูลตั้งต้น (หมวดหมู่ และ รายชื่อลุคทั้งหมด)
  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            const [looksRes] = await Promise.all([
                fetch('http://localhost:5000/api/looks') // API ที่ดึงลุคทั้งหมด
            ]);
            const looksData = await looksRes.json();
            
            // เก็บเฉพาะ "ชื่อ" ของลุคทั้งหมดไว้ใน State
            setAllLookNames(looksData.map(l => l.lookName));

        } catch (error) {
            console.error("Failed to fetch initial data:", error);
        }
    };
    fetchInitialData();
  }, []);

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
    
    const isNewLook = !look;
    const newName = formData.lookName.trim();
    const newNameLC = newName.toLowerCase();

    if (!newName) return;

    // หาชื่อที่ "คล้ายกันมาก" (ต้องแก้แค่ 1-2 ตัวอักษร)
    const similarMatch = allLookNames.find(name => {
        const distance = levenshteinDistance(newNameLC, name);
        // ถ้าชื่อไม่ตรงกันเป๊ะ และต้องแก้ไม่เกิน 2 ตัวอักษร ให้ถือว่าคล้าย
        return distance > 0 && distance <= 2; 
    });

    // เงื่อนไขการทำงาน
    if (isNewLook && similarMatch) {
        // ถ้าเป็นการเพิ่มใหม่ และเจอชื่อที่ "คล้าย"
        const userConfirmed = window.confirm(
            `'${newName}' มีความคล้ายกับลุคที่มีอยู่แล้ว: '${similarMatch}'\n\nคุณแน่ใจหรือไม่ว่าต้องการสร้างเป็นลุคใหม่?`
        );
        if (userConfirmed) {
            onSave(formData); // ถ้าผู้ใช้ยืนยัน ก็บันทึก
        }
    } else {
        // ถ้าเป็นการ "แก้ไข" หรือ "ชื่อใหม่ที่ไม่คล้ายใครเลย"
        // ให้ทำการบันทึกได้เลย (Backend จะจัดการเรื่องชื่อซ้ำเป๊ะๆ เอง)
        onSave(formData);
    }
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