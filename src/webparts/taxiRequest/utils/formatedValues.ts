import * as dayjs from 'dayjs';
import createRequestID from './createRequestID';

function formToServer(values: Record<string, any>): any {
  const { ID, DropDate, DropTime, PickerupDate, PickerupTime, ...rest } =
    values;
  return {
    ...rest,
    Requester_x002a_: "578",
    //ID: ID || createRequestID(),
    DropDate:
      DropDate instanceof Date
        ? dayjs(DropDate).format('DD/MM/YYYY')
        : DropDate,
    DropTime:
      DropTime instanceof Date ? dayjs(DropTime).format('HH:mm') : DropTime,
    PickerupDate:
      PickerupDate instanceof Date
        ? dayjs(PickerupDate).format('DD/MM/YYYY')
        : PickerupDate,
    PickerupTime:
      PickerupTime instanceof Date
        ? dayjs(PickerupTime).format('HH:mm')
        : PickerupTime,
  };
}

export { formToServer };
