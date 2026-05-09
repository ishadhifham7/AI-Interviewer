import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Use a fallback for development, but ideally this comes from process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'ai_mentor_super_secret_key_123';

export const AuthService = {
  // 1. Hash a password (for registration)
  hashPassword: async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },

  // 2. Compare password (for login)
  comparePassword: async (password: string, hashed: string) => {
    return await bcrypt.compare(password, hashed);
  },

  // 3. Create a JWT Token
  generateToken: (userId: string) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: '7d', // Token lasts 1 week
    });
  }
};