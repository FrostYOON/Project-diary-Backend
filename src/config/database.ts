import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }
    await mongoose.connect(mongoURI);

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB 연결 오류:', error);
    });

    mongoose.connection.on('disconnected', async () => {
      console.log('MongoDB 연결이 끊어졌습니다. 연결을 재시도합니다...');
      try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB 연결 재시도 성공');
      } catch (error) {
        console.error('MongoDB 연결 재시도 실패:', error);
        process.exit(1);
      }
    });
    console.log('MongoDB 연결 성공');
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB 연결이 종료됩니다...');
    process.exit(0);
  } catch (error) {
    console.error('MongoDB 연결 종료 실패:', error);
    process.exit(1);
  }
});

export default connectDB;