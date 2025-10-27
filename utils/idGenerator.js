const mongoose = require('mongoose');

async function generateUniqueID(ClipModel) {
  // Get the maximum ID using MongoDB aggregation
  const result = await ClipModel.aggregate([
    { $group: { _id: null, maxID: { $max: "$ID" } } }
  ]);

  const maxID = result.length > 0 ? result[0].maxID : 0;
  let currentDigits = maxID > 0 ? Math.floor(Math.log10(maxID)) + 1 : 4;
  
  // ลองหา ID ที่ว่างในแต่ละช่วงหลัก
  while (currentDigits <= 10) { // จำกัดไว้ที่ 10 หลักเพื่อความปลอดภัย
    const availableID = await findAvailableID(ClipModel, currentDigits);
    if (availableID) {
      return availableID;
    }
    // ถ้าไม่เจอ ID ที่ว่างในจำนวนหลักปัจจุบัน เพิ่มจำนวนหลัก
    currentDigits++;
  }

  // ถ้าไม่สามารถหา ID ที่ว่างได้แม้แต่ใน 10 หลัก
  throw new Error('Cannot generate unique ID: Maximum ID range exceeded');
}

async function findAvailableID(ClipModel, digits, maxAttempts = 100) {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  
  // สร้างเซตของ ID ที่ใช้ไปแล้วในช่วงที่จะลอง
  const usedIDs = new Set(
    (await ClipModel.find({
      ID: { $gte: min, $lte: max }
    })
    .select('ID')
    .lean())
    .map(doc => doc.ID)
  );

  // ถ้าช่วงนี้เต็มแล้ว return null เพื่อให้เพิ่มจำนวนหลัก
  if (usedIDs.size >= (max - min + 1)) {
    return null;
  }

  // พยายามสุ่ม ID ที่ไม่ซ้ำ
  for (let i = 0; i < maxAttempts; i++) {
    const candidateID = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!usedIDs.has(candidateID)) {
      // ตรวจสอบอีกครั้งกับฐานข้อมูลเพื่อความแน่ใจ
      const exists = await ClipModel.findOne({ ID: candidateID }).select('ID').lean();
      if (!exists) {
        return candidateID;
      }
    }
  }

  // ถ้าสุ่มไม่เจอหลายครั้งแล้ว ลองหาแบบเรียงลำดับ
  for (let id = min; id <= max; id++) {
    if (!usedIDs.has(id)) {
      const exists = await ClipModel.findOne({ ID: id }).select('ID').lean();
      if (!exists) {
        return id;
      }
    }
  }

  // ถ้ายังไม่เจอ return null เพื่อให้เพิ่มจำนวนหลัก
  return null;
}

module.exports = generateUniqueID;