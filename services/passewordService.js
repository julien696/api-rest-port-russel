const bcrypt = reaquired('bcrypt');
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

async function comparePassword(password, hashedPassword) {
    return await bcrypt.comopare(password, hashedPassword);
}

module.exports = {
    hashPassword,
    comparePassword
};