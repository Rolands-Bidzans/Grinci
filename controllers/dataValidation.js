function validatePassword(password) {
    const minLength = 8; // Minimum length requirement
    const hasUpperCase = /[A-Z]/.test(password); // Checks for at least one uppercase letter
    const hasLowerCase = /[a-z]/.test(password); // Checks for at least one lowercase letter
    const hasNumbers = /[0-9]/.test(password); // Checks for at least one number
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Checks for at least one special character

    if (password.length < minLength) {
        return { valid: false, message: `Password must be at least ${minLength} characters long.` };
    }
    if (!hasUpperCase) {
        return { valid: false, message: 'Password must contain at least one uppercase letter.' };
    }
    if (!hasLowerCase) {
        return { valid: false, message: 'Password must contain at least one lowercase letter.' };
    }
    if (!hasNumbers) {
        return { valid: false, message: 'Password must contain at least one number.' };
    }
    if (!hasSpecialChars) {
        return { valid: false, message: 'Password must contain at least one special character.' };
    }

    return { valid: true, message: 'Password is valid.' };
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9._]{3,20}$/;
    return usernameRegex.test(username);
}

module.exports = { validatePassword, validateEmail, validateUsername};