const theValidationProceeded = ({res, status, objectToValid, objectValidation}) => {
  const objectErrors = objectValidation.validate(objectToValid).error;
  res.status(status).send(objectErrors.details[0].message);

  return !objectErrors;
};


export { theValidationProceeded };
