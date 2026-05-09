import { Request, Response } from 'express';
import { AuthService } from './auth.service';

// 1. Define a User Interface to replace 'any'
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

// Line 5: Fixed by using the User interface instead of any[]
const users: User[] = []; 

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = users.find(u => u.email === email);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await AuthService.hashPassword(password);
    
    const newUser: User = { 
      id: Date.now().toString(), 
      email, 
      password: hashedPassword, 
      name 
    };
    users.push(newUser);

    const token = AuthService.generateToken(newUser.id);
    res.status(201).json({ token, user: { id: newUser.id, email, name } });
  } catch (error: unknown) { 
    // Line 22: Fixed by typing error as 'unknown' or 'any'
    const message = error instanceof Error ? error.message : "Registration failed";
    res.status(500).json({ message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !(await AuthService.comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = AuthService.generateToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error: unknown) {
    // Line 38: Fixed similarly to line 22
    const message = error instanceof Error ? error.message : "Login failed";
    res.status(500).json({ message });
  }
};