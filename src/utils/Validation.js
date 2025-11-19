export const CheckValidation = (fields) => {
    const mandatoryFields = Object.keys(fields);
    const missingFields = mandatoryFields.filter((field) => {
      const value = fields[field];
      return value === undefined || value === null || value === "";
    });
  
    return missingFields;
  };
  