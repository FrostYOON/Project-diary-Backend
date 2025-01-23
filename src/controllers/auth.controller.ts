import dotenv from 'dotenv';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model'; // 유저 스키마
import bcrypt from 'bcrypt';

dotenv.config();

// 일반 로그인
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // 1. 사용자 조회
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: '가입되지 않은 계정입니다.' });
        }
        // 2. 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({ message: '인증되지 않았습니다. 올바른 인증 정보를 제공해주세요.' });
        }

        // JWT_SECRET_KEY가 없을 경우 에러 처리
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('JWT_SECRET_KEY is not defined');
        }
        
        // 3. 토큰 발급
        const token = jwt.sign(
            { _id: user._id }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn: '1h' }
        );
        
        res.status(200).json({ 
            message: '로그인에 성공했습니다.', 
            token,
            user: { email: user.email, name: user.name }, // 필요한 사용자 정보 반환
        });
    }
    catch (error) {
        return res.status(500).json({ message: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    }
}

export async function googleLogin(req: Request, res: Response) {
    let token = null;
    const user = req.user as IUser;

    if (user && process.env.JWT_SECRET_KEY) {
        const payload = { _id: user._id };
        token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    }
    res.cookie('token', token)
    res.json({ token });
}



