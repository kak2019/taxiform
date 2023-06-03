import { useState } from 'react';
import createRequestID from '../utils/createRequestID';

function isEmpty(str: unknown) {
  if (!str) return true;
  if (typeof str === 'string' && str.trim().length === 0) return true;
  return false;
}

function createInitForm(): Record<string, unknown> {
  return {
    ID: createRequestID(),
    Requestor: undefined,
    Phone: undefined,
    Gender: undefined,
    Alternate: undefined,
    Paymode: undefined,
    Email: undefined,
    Designation: undefined,
    Manager: undefined,
    ApprovedBy: undefined,
    CostCentre: undefined,
    RentalCity: undefined,
    CarModel: undefined,
    PickupLocation: undefined,
    PickerupDate: undefined,
    PickerupTime: undefined,
    PickupType: undefined,
    Justification: undefined,
    DropLocation: undefined,
    DropDate: undefined,
    DropTime: undefined,
    AdditionalInstructions: undefined,
  };
}

const intialValues = createInitForm();

function useFormControl() {
  const [values, setValues] = useState(intialValues);
  const [errors, setErrors] = useState(intialValues);

  const setFieldValue = (label: string, value: unknown): void => {
    setValues((v) => ({ ...v, [label]: value }));
    return;
  };

  const setFieldsValue = (_values: Record<string, unknown>): void => {
    const updates = Object.keys(_values).reduce(
      (pre, cur) => ({ ...pre, [cur]: _values[cur] }),
      [],
    );
    setValues((v) => ({ ...v, ...updates }));
    return;
  };

  const getFieldsValues = () => {
    return values;
  };

  const validateFields = () => {
    const _errors: any = {};

    setErrors({});
    if (isEmpty(values.Requestor)) {
      _errors['Requestor'] = 'Required';
    }
    if (isEmpty(values.Email)) {
      _errors['Email'] = 'Required';
    }
    if (isEmpty(values.Gender)) {
      _errors['Gender'] = 'Required';
    }
    if (isEmpty(values.Manager)) {
      _errors['Manager'] = 'Required';
    }
    if (isEmpty(values.ApprovedBy)) {
      _errors['ApprovedBy'] = 'Required';
    }
    if (isEmpty(values.Paymode)) {
      _errors['Paymode'] = 'Required';
    }
    if (isEmpty(values.PickupType)) {
      _errors['PickupType'] = 'Required';
    }
    if (isEmpty(values.CarModel)) {
      _errors['CarModel'] = 'Required';
    }
    if (isEmpty(values.PickupLocation)) {
      _errors['PickupLocation'] = 'Required';
    }

    setErrors(_errors);
    const hasErrors = Object.keys(_errors).length > 0;
    // if (hasErrors) {
    //   return Promise.reject(new Error(_errors));
    // }
    return Promise.resolve(values);
  };

  return {
    values,
    errors,
    setFieldsValue,
    setFieldValue,
    getFieldsValues,
    validateFields,
  };
}

export default useFormControl;
