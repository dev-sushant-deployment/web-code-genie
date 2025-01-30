"use server";

import { db } from "@/lib/db";
import { compare, hash } from "bcryptjs"
import jwt from "jsonwebtoken";

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const signup = async (name: string, email: string, password: string) => {
  const isEmailValid = validateEmail(email);
  if (!isEmailValid) return { error: 'Invalid email', status: 400 };
  if (!password) return { error: 'Password is required', status: 400 };
  if (!name) return { error: 'Name is required', status: 400 };
  try {
    const hashedPassword = await hash(password, 10);
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    });
    return { data: { message: 'User created successfully' }, status: 201 };
  } catch (error) {
    console.log("error in signup", error);
    const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
    return { error: message, status: 500 };
  }
}

export const login = async (email: string, password: string) => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
  const isEmailValid = validateEmail(email);
  if (!isEmailValid) return { error: 'Invalid email', status: 400 };
  if (!password) return { error: 'Password is required', status: 400 };
  try {
    const user = await db.user.findUnique({
      where: { email },
      select: {
        password: true,
        name: true,
      }
    });
    if (!user) return { error: 'User not found', status: 404 };
    const isPasswordCorrect = compare(password, user.password);
    if (!isPasswordCorrect) return { error: 'Invalid password', status: 400 };
    const accessToken = jwt.sign({ email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { accessToken, name: user.name, status: 200 };
  } catch (error) {
    // console.log("error in login", error);
    const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
    return { error: message, status: 500 };
  }
}

export const middleware = async (accessToken: string) => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
  if (!accessToken) return { error: 'Access token is required', status: 401 };
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (typeof decoded === 'string' || !('email' in decoded)) {
      return { error: 'Invalid token', status: 401 };
    }
    const { email } = decoded;
    const user = await db.user.findUnique({
      where: { email },
      select: { name: true }
    });
    if (!user) return { error: 'User not found', status: 404 };
    return { name: user.name , email, status: 200 };
  } catch (error) {
    // console.log("error in middleware", error);
    const message = error instanceof Error ? error.message : 'An Unexpected error occurred';
    return { error: message, status: 500 };
  }
}