import mongoose from 'mongoose';

/**
 * Migration Script
 * 
 * 작성자: 윤준호
 * 
 * [ 마이그레이션 내용 ]
 * 
 * folder collection에 visible true 필드 추가
 * 
 */

async function addVisibleField() {
  const uri: string = '<URL 여기에 추가>';

  try {
    await mongoose.connect(uri);
    const folderSchema = new mongoose.Schema({}, { strict: false });
    const Folder = mongoose.model('Folder', folderSchema, 'folders'); 

    const result = await Folder.updateMany({}, { $set: { visible: true } });

    console.log(`Total Changes: ${result.modifiedCount}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
  }
  console.log("Migration finished")
}

addVisibleField();