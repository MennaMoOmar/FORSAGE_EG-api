const { validationResult } = require("express-validator");

module.exports = (validatorArray) => async (req, res, next) => {
  const promises = validatorArray.map((validator) => validator.run(req));
  await Promise.all(promises);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({error: "Oops Validation Error!", statusCode:400})
  }
  next();
};