import connectDB from './config/database';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 3001;

const server = async () => {
  try {
    // MongoDB 연결
    await connectDB();

    // 서버 실행
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server 실행 오류:', error);
    process.exit(1);
  }
}

server();
