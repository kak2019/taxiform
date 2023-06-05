import * as React from 'react';
import styles from './TaxiRequest.module.scss';
import { TextField } from '@fluentui/react/lib/TextField';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { Stack, IStackProps, IStackStyles } from '@fluentui/react/lib/Stack';
import {
  Dropdown,
  Toggle,
  defaultDatePickerStrings,
  DatePicker,
  DayOfWeek,
  TimePicker,
} from '@fluentui/react';
import { formToServer } from '../utils/formatedValues';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import {
  carModelOptions,
  genderOptions,
  payModeOptions,
  pickupTypeOptions,
  // statusOptions,
} from './constants';
import useProfile from '../hooks/useProfile';
import PeoplePicker from './PeoplePicker';
import useFormControl from '../hooks/useFormControl';
import { addRequest, fetchById } from '../utils/request';
import { IWebEnsureUserResult } from '@pnp/sp/site-users/types';
import { spfi } from '@pnp/sp';
import { getSP } from '../pnpjsConfig';
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import { Field } from '@pnp/sp/fields/types';
import * as dayjs from 'dayjs';
import { useUrlQueryParam } from '../hooks/useUrlQueryParam'
import { ISiteUser } from "@pnp/sp/site-users/";

const stackTokens = { childrenGap: 50 };
const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };
const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 15 },
  styles: { root: { width: 300 } },
};
const singleColumnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 15 },
  styles: { root: { width: 650 } },
};

export default function TaxiRequestNew() {
  const formRef = React.useRef();
  const [{ID}] = useUrlQueryParam(['ID'])
  const { fetchData } = useProfile();
  
  const {
    values,
    errors,
    setFieldsValue,
    setFieldValue,
    getFieldsValues,
    validateFields,
  } = useFormControl();
  const [showAlert, toggleShowAlert] = React.useState(false);
  const [justificationRequired,setjustificationRequired] = React.useState(false);
  const [alternateValue,setalternateValue] = React.useState(false);
  const init = async () => {
    const profile1 = await fetchData();
    // EDIT TODO
    console.log(ID)
    // const profile:any = await fetchById({Id: Number(ID)});
    // if(typeof profile === 'string') {
    //   throw console.log(profile)
    // }
    // console.log(profile)
    const sp = spfi(getSP());
    // const requestor: ISiteUser = sp.web.getUserById(profile.Requester_x002a_Id);
    // const requestorData = await requestor.select("Title")();

    // const manager: ISiteUser = sp.web.getUserById(profile.ManagerId);
    // const Approver: ISiteUser = sp.web.getUserById(profile.ApproverId);
    // const managerData = await manager();
    // const ApproverData = await Approver();

    // setFieldsValue({
    //   //Requestor: requestorData.Title,
    //   Requestor: profile.Requestor,
    //   //Email: profile.field_3?profile1.Email,
    //   Email: profile1.Email,
    //   Phone: profile.field_4,
    //   //Phone: profile1.phone,
    //   Gender: profile.field_6,
    //   Alternate: profile.AlternateApprover,
    //   Paymode: profile.field_16?profile.field_16:"BilltoCompany",
    //   Designation: profile.field_5,
    //   CostCentre: profile.field_15,
    //   RentalCity: profile.field_8,
    //   CarModel: profile.field_10,
    //   PickupLocation: profile.field_12,
    //   PickerupDate: profile.field_13 ? new Date(profile.field_13.replace('Z', '')) : '',
    //   PickerupTime: profile.field_13 ? new Date(profile.field_13.replace('Z', '')) : '',
    //   PickupType: profile.field_9,
    //   Justification: profile.field_11,
    //   DropLocation: profile.field_18,
    //   DropDate: profile.field_14 ? new Date(profile.field_14.replace('Z', '')) : '',
    //   DropTime: profile.field_14 ? new Date(profile.field_14.replace('Z', '')) : '',
    //   AdditionalInstructions: profile.field_20,
    //   //Approver: profile.ApproverId,
    //   Manager: managerData,
    //   ManagerId: profile.ManagerId,
    //   Approver:ApproverData,
    //   ApproverId:profile.ApproverId
    // }) 
    setFieldsValue({
      //Requestor: requestorData.Title,
      Requestor: profile1.Requestor,
      //Email: profile.field_3?profile1.Email,
      Email: profile1.Email,
      Phone: null,
      //Phone: profile1.phone,
      Gender: null,
      Alternate: null,
      Paymode: "BilltoCompany",
      Designation: profile1.Designation,
      CostCentre: null,
      RentalCity: null,
      CarModel: "Mini",
      PickupLocation: null,
      PickerupDate:  new Date(),
      PickerupTime: new Date(),
      PickupType: null,
      Justification: null,
      DropLocation: null,
      DropDate: new Date(),
      DropTime: new Date(),
      AdditionalInstructions: null,
      //Approver: profile.ApproverId,
      Manager: null,
      ManagerId: null,
      Approver:null,
      ApproverId:null
    })
  };

  React.useEffect(() => {
    void init()
  }, []);
  const handleSubmit = () => {
    const sp = spfi(getSP());
    console.log('submit');
    validateFields()
      .then(async (values) => {
        // validate date & time
        const dropDateTime = dayjs( dayjs(values.DropDate).format('YYYY/MM/DD') + ' ' + dayjs(values.DropTime).format('HH:mm'))
        const pickerupDateTime = dayjs( dayjs(values.PickerupDate).format('YYYY/MM/DD') + ' ' + dayjs(values.PickerupTime).format('HH:mm'))
        const now = dayjs()
        const diffHoursDrop =  Math.abs(dayjs(dropDateTime).diff(dayjs(now), 'hour'));
        const dffHoursPickerup = Math.abs(dayjs(pickerupDateTime).diff(dayjs(now), 'hour'));
        const vaildpickupbefore  = dayjs(pickerupDateTime).isBefore(dayjs(now)) ;
        const vailddropbefore = dayjs(dropDateTime).isBefore(dayjs(now));
        

        if((values.PickupType==="local(Bangalore)" && !vaildpickupbefore && !vailddropbefore&& (diffHoursDrop > 3 || dffHoursPickerup > 3))) {
          return toggleShowAlert(false)
        }else if((values.PickupType==="Outstation" &&!vaildpickupbefore && !vailddropbefore&&(diffHoursDrop > 24 || dffHoursPickerup > 24))) {
          return toggleShowAlert(false)
        } 
        else {
          toggleShowAlert(true)
        }
        //const request = formToServer(values);
        //const user = await spfi(getSP()).web.siteUsers.getByEmail("group.spah.flow.mgmt@udtrucks.com")();
        // console.log(user)
        //console.log(values.Manager)
        const result: IWebEnsureUserResult = await sp.web.ensureUser("i:0#.f|membership|" + values.Email);
        const resultManager: IWebEnsureUserResult = await sp.web.ensureUser(values.Manager.LoginName);

       
        const resultApprover: IWebEnsureUserResult = await sp.web.ensureUser(values.Approver?.LoginName);
        console.log(values.PickerupDate)
        console.log(values.PickerupTime)
        //console.log(resultApprover)
        //假设有Approver
        let request={};
        if(alternateValue){
        request = {
          field_3: values.Email,
          Requester_x002a_Id: result.data.Id,
          //
          //Phone
          field_4: values.Phone,
          //Gender
          field_6: values.Gender,
          //AlternateApprover
          AlternateApprover: values.Alternate,
          //Paymode
          field_16: values.Paymode,
          //Email
          //Designation
          field_5: values.Designation,
          ManagerId: resultManager.data.Id,
          ApproverId: resultApprover.data.Id,
          //CostCentre
          field_15: values.CostCentre,
          //RentalCity
          field_8: values.RentalCity,
          //CarModel
          field_10: values.CarModel,
          //PickupLocation
          field_12: values.PickupLocation,
           //PickerupDate + time
          field_13: dayjs(values.PickerupDate).format('YYYY-MM-DD')+"T"+dayjs(values.PickerupTime).format('HH:mm:ss')+"Z",
          //PickerupTime: undefined, 页面是两个 需要提交到一个框
          //PickupType
          field_9: values.PickupType,
          //Justification
          field_11: values.Justification,
          //DropLocation
          field_18: values.DropLocation,
          //DropDate + DropTime
          field_14: dayjs(values.DropDate).format('YYYY-MM-DD')+"T"+dayjs(values.DropTime).format('HH:mm:ss')+"Z",
          //DropTime: undefined,
          //AdditionalInstructions
          field_20: values.AdditionalInstructions, 
        }}else{
          request = {
            field_3: values.Email,
            Requester_x002a_Id: result.data.Id,
            //
            //Phone
            field_4: values.Phone,
            //Gender
            field_6: values.Gender,
            //AlternateApprover
            AlternateApprover: values.Alternate,
            //Paymode
            field_16: values.Paymode,
            //Email
            //Designation
            field_5: values.Designation,
            ManagerId: resultManager.data.Id,
            //ApproverId: resultApprover.data.Id,
            //CostCentre
            field_15: values.CostCentre,
            //RentalCity
            field_8: values.RentalCity,
            //CarModel
            field_10: values.CarModel,
            //PickupLocation
            field_12: values.PickupLocation,
             //PickerupDate + time
            field_13: dayjs(values.PickerupDate).format('YYYY-MM-DD')+"T"+dayjs(values.PickerupTime).format('HH:mm:ss')+"Z",
            //PickerupTime: undefined, 页面是两个 需要提交到一个框
            //PickupType
            field_9: values.PickupType,
            //Justification
            field_11: values.Justification,
            //DropLocation
            field_18: values.DropLocation,
            //DropDate + DropTime
            field_14: dayjs(values.DropDate).format('YYYY-MM-DD')+"T"+dayjs(values.DropTime).format('HH:mm:ss')+"Z",
            //DropTime: undefined,
            //AdditionalInstructions
            field_20: values.AdditionalInstructions, 
        }}
        console.log(request);
        //if(resultApprover!==undefined){request[ApprovedById]= resultApprover.data.Id }
        addRequest({ request })
          .then(() => {
            //
          })
          .catch(() => {
            //
          });
      })
      .catch(() => {
        //
      });
  };

  return (
  <form ref={formRef}>
      <section>
        {/* <h2>[RE India] - Taxi Request - {values.ID} </h2>
        <br /> */}
        <h1>Requestor Information</h1>
      </section>
      <Stack horizontal tokens={stackTokens} styles={stackStyles}>
        <Stack {...columnProps}>
          <TextField
            label="Requestor Name"
            required
            name="Requestor"
            value={values.Requestor as string}
            onChange={(e) => {
              const v = (e.target as HTMLInputElement).value;
              setFieldValue('Requestor', v);
            }}
            errorMessage={errors.Requestor as string}
          />
          <TextField
            label="Phone Number"
            type="number"
            name="Phone"
            value={values.Phone as string}
            onChange={(e) => {
              const v = (e.target as HTMLInputElement).value;
              setFieldValue('Phone', v);
            }}
            errorMessage={errors.Phone as string}
          />

          <Dropdown
            placeholder="Select an option"
            label="Gender"
            required
            options={genderOptions}
            // name="Gender"
            selectedKey={[values.Gender as string].filter(Boolean)}
            onChange={(e, option) => {
              setFieldValue('Gender', option.key);
            }}
            errorMessage={errors.Gender as string}
          />
          <Toggle
            label="Alternate Approver"
            //defaultChecked
            onText="On"
            offText="Off"
            // name="Alternate"
            checked={values.AlternateApprover as boolean}
            onChange={(e, checked) => {
              setFieldValue('AlternateApprover', checked);
              setalternateValue(checked)
            }}
            style={{ marginBottom: 4 }}
          />
          <Dropdown
            placeholder="Select an option"
            label="Paymode"
            required
            defaultSelectedKey="BilltoCompany"
            options={payModeOptions}
            //selectedKey={[values.Paymode as string].filter(Boolean)}
            onChange={(e, option) => {
              setFieldValue('Paymode', option.key);
            }}
            errorMessage={errors.Paymode as string}
          // name="Paymode"
          />
        </Stack>
        <Stack {...columnProps}>
          <TextField
            label="Email"
            required
            readOnly
            name="Email"
            value={values.Email as string}
            onChange={(e) => {
              const v = (e.target as HTMLInputElement).value;
              setFieldValue('Email', v);
            }}
            errorMessage={errors.Email as string}
          />
          <TextField
            label="Designation"
            name="Designation"
            value={values.Designation as string}
            onChange={(e) => {
              const v = (e.target as HTMLInputElement).value;
              setFieldValue('Designation', v);
            }}
            errorMessage={errors.Designation as string}
          />
          <PeoplePicker
            key={values.ManagerId}
            defaultValue={values.ManagerId}
            defaultText={values.Manager && values.Manager.Title}
            onChange={(v: any) => {
              setFieldValue('Manager', v);
            }}
            required
            label="Manager"
            errorMessage={errors.Manager as string}
          // name="Manager"
          />

          {/* 这个得是 people picker */}
          <PeoplePicker
            key={values.ApproverId}
            defaultValue={values.ApproverId}
            defaultText={values.Approver && values.Approver.Title}
            onChange={(v: any) => {
              setFieldValue('Approver', v);
            }}
            required={alternateValue}
            
            errorMessage={errors.Approved as string}
            // name="ApprovedBy "
            label="Approver"
           
          />
          <TextField
            label="Cost Centre"
            value={values.CostCentre as string}
            onChange={(e) => {
              const v = (e.target as HTMLInputElement).value;
              setFieldValue('CostCentre', v);
            }}
            errorMessage={errors.CostCentre as string}
          />
        </Stack>
      </Stack>
      <section>
        <h3>Booking Details</h3>
      </section>
      <Stack horizontal tokens={stackTokens} styles={stackStyles}>
        <Stack {...columnProps}>
         <Dropdown
          placeholder="Select an option"
          label="Pickup Type"
          required
          // name="PickupType"
          options={pickupTypeOptions}
          selectedKey={[values.PickupType as string].filter(Boolean)}
          onChange={(e, option) => {
            setFieldValue('PickupType', option.key);
            if(option.key==="local(Bangalore)"){setFieldValue("RentalCity","Bangalore")}else{setFieldValue("RentalCity",null)}
          }}
          errorMessage={errors.PickupType as string}
        />
          <Dropdown
            placeholder="Select an option"
            label="Car Type"
            required
            // name="CarModel"
            options={carModelOptions}
            selectedKey={[values.CarModel as string].filter(Boolean)}
            onChange={(e, option) => {
              setFieldValue('CarModel', option.key);
              //回头再优化 
              if(option.key==='innova crysta' || option.key==='premium cars'){setjustificationRequired(true)}else{setjustificationRequired(false)}
            }}
            errorMessage={errors.CarModel as string}
          />
          <TextField
            label="Pickup Location"
            required
            name="PickupLocation"
            value={values.PickupLocation as string}
            onChange={(e) => {
              const v = (e.target as HTMLInputElement).value;
              setFieldValue('PickupLocation', v);
            }}
            errorMessage={errors.PickupLocation as string}
          />
          <Stack
            styles={{ root: { width: 300 } }}
            horizontal
            tokens={{ childrenGap: 20 }}
          >
            <DatePicker
              style={{ width: 200 }}
              firstDayOfWeek={DayOfWeek.Sunday}
              label="Pickerup Date"
              // name="PickerupDate"
              value={values.PickerupDate as Date}
              onSelectDate={(date) => {
                setFieldValue('PickerupDate', date);
              }}
              strings={defaultDatePickerStrings}
            />
            <TimePicker
              label="Pickerup Time"
              allowFreeform
              value={values.PickerupTime as Date}
              onChange={React.useCallback((e, time) => {
                setFieldValue('PickerupTime', time);
              }, [])}
              style={{ width: 200 }}
            />
          </Stack>
        </Stack>
        <Stack {...columnProps}>
        <TextField
            label="Rental City"
            name="RentalCity"
            value={values.RentalCity as string}
            onChange={(e) => {
              const v = (e.target as HTMLInputElement).value;
              setFieldValue('RentalCity', v);
            }}
            errorMessage={errors.RentalCity as string}
          /> 
          <TextField
            label="Justification"
            name="Justification"
            value={values.Justification as string}
            required={justificationRequired}
            onChange={(e) => {
              const v = (e.target as HTMLInputElement).value;
              setFieldValue('Justification', v);
            }}
            errorMessage={errors.Justification as string}
          />
          <TextField
            label="Drop Location"
            name="DropLocation"
            value={values.DropLocation as string}
            onChange={(e) => {
              const v = (e.target as HTMLInputElement).value;
              setFieldValue('DropLocation', v);
            }}
            errorMessage={errors.DropLocation as string}
          />
          <Stack
            styles={{ root: { width: 300 } }}
            horizontal
            tokens={{ childrenGap: 20 }}
          >
            <DatePicker
              style={{ width: 200 }}
              firstDayOfWeek={DayOfWeek.Sunday}
              label="Drop Date"
              value={values.DropDate as Date}
              onSelectDate={(date) => {
                setFieldValue('DropDate', date);
              }}
              // name="DropDate"
              strings={defaultDatePickerStrings}
            />
            <TimePicker
              label="Drop Time"
              style={{ width: 200 }}
              value={values.DropTime as Date}
              onChange={(e, time) => {
                setFieldValue('DropTime', time);
              }}
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack horizontal tokens={stackTokens} styles={stackStyles}>
        <Stack {...singleColumnProps}>
          <TextField
            label="Additional Instruction"
            multiline
            name="AdditionalInstructions"
            value={values.AdditionalInstructions as string}
            onChange={(e) => {
              const v = (e.target as HTMLInputElement).value;
              setFieldValue('AdditionalInstructions', v);
            }}
            errorMessage={errors.AdditionalInstructions as string}
          />
        </Stack>
      </Stack>

      <Stack
        enableScopedSelectors
        horizontalAlign="end"
        style={{ paddingRight: 100, marginTop: 40, marginBottom: 20 }}
        horizontal
      >

        {showAlert && (
          <MessageBar
            delayedRender={false}
            // Setting this to error, blocked, or severeWarning automatically sets the role to "alert"
            messageBarType={MessageBarType.error}
            // Or you could set the role manually, IF an alert role is appropriate for the message
            // role="alert"
          >
           please check Pickup date & time and Drop Date & time
          </MessageBar>
        )}
        <PrimaryButton
          text="Submit"
          allowDisabledFocus
          style={{ marginRight: 24 }}
          onClick={handleSubmit}
        />
        <DefaultButton text="Cancel" allowDisabledFocus />
      </Stack>
    </form>
  );
}
