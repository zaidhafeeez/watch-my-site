import { hash, compare } from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password) {
    return await hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, hashedPassword) {
    return await compare(password, hashedPassword);
}

export function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return { isValid: false, error: 'Password must be at least 8 characters long' };
    }
    if (!hasUpperCase || !hasLowerCase) {
        return { isValid: false, error: 'Password must include both upper and lowercase letters' };
    }
    if (!hasNumbers) {
        return { isValid: false, error: 'Password must include at least one number' };
    }
    if (!hasSpecialChar) {
        return { isValid: false, error: 'Password must include at least one special character' };
    }

    return { isValid: true };
}
