module.exports = (res, data, message = "Success", Code = 200) => {
  res.status(Code).json({
    Code: Code,
    data: data,
    message: message,
  });
};
