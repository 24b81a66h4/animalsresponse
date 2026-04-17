const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const isStrongPassword = (password) => {
    // At least 6 chars
    return password && password.length >= 6;
};

const isNotEmpty = (value) => {
    return value && value.trim().length > 0;
};

module.exports = {
    isValidEmail,
    isStrongPassword,
    isNotEmpty
};