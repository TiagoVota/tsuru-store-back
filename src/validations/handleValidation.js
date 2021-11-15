const theValidationProceeded = (params) => {
  const {
    res, 
    status, 
    objectToValid, 
    objectValidation
  } = params;

  const objectErrors = objectValidation.validate(objectToValid).error;

  if (objectErrors) res.status(status).send(objectErrors.details[0].message);

  return !objectErrors;
};


export { theValidationProceeded };
