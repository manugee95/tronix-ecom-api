//Password Validation Function
const validatePassword = (password) => {
  const pass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return pass.test(password);
};

module.exports = validatePassword