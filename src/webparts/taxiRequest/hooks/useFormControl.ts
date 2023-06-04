import { useState } from 'react';
import createRequestID from '../utils/createRequestID';

function isEmpty(str: unknown) {
  if (!str) return true;
  if (typeof str === 'string' && str.trim().length === 0) return true;
  return false;
}

function createInitForm(): Record<string, any> {
  return {
    //ID: createRequestID(),
    Requester_x002a_Id: undefined,
    //Phone
    field_4: undefined,
    //Gender
    field_6: undefined,
    //AlternateApprover
    AlternateApprover: undefined,
    //Paymode
    field_16: undefined,
    //Email
    field_3: undefined,
    //Designation
    field_5: undefined,
    ManagerId: undefined,
    ApprovedById: undefined,
    //CostCentre
    field_15: undefined,
    //RentalCity
    field_8: undefined,
    //CarModel
    field_10: undefined,
    //PickupLocation
    field_12: undefined,
    //PickerupDate + time
    field_13: undefined,
    //PickerupTime: undefined, 页面是两个 需要提交到一个框
    //PickupType
    field_9: undefined,
    //Justification
    field_11: undefined,
    //DropLocation
    field_18: undefined,
    //DropDate + DropTime
    field_14: undefined,
    //DropTime: undefined,
    //AdditionalInstructions
    field_20: undefined,
    PickerupTime: new Date(),
    DropTime: new Date()
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
