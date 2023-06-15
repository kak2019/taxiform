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
import useProfileManager from '../hooks/useManager';

function isEmpty(str: unknown) {
  if (!str) return true;
  if (typeof str === 'string' && str.trim().length === 0) return true;
  return false;
}
const format = 'HH:mm';
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
  const [{ ITEMID }] = useUrlQueryParam(['ITEMID'])
  const { fetchData } = useProfile();
  //const {fetchData1} = useProfileManager("i:0#.f|membership|flynt.gao@consultant.udtrucks.com");


  const {
    values,
    errors,
    setFieldsValue,
    setFieldValue,
    getFieldsValues,
    validateFields,
  } = useFormControl();
  const [showAlert, toggleShowAlert] = React.useState(false);
  const [justificationRequired, setjustificationRequired] = React.useState(false);
  const [alternateValue, setalternateValue] = React.useState(false);
  const [WaringMessage, setWaringMessage] = React.useState("")
  const init = async () => {
    const profile1 = await fetchData();
    const { fetchData1 } = useProfileManager(profile1.AccountName);
    const profile2 = await fetchData1()
    // EDIT TODO
    console.log(ITEMID)
    console.log(profile2)
    console.log(profile2.WorkPhoneNumber)
    // const profile:any = await fetchById({Id: Number(ID)});
    // if(typeof profile === 'string') {
    //   throw console.log(profile)
    // }
    // console.log(profile)
    const sp = spfi(getSP());
    const resultManager: IWebEnsureUserResult = await sp.web.ensureUser(profile2.lastApprover);
    //console.log(resultManager)
    const managerpromise: ISiteUser = sp.web.getUserById(resultManager.data.Id);
    const Manager = await managerpromise();
    //console.log(managerinfo.Title)
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
      Phone: profile2.WorkPhoneNumber,
      //Phone: profile1.phone,
      Gender: null,
      Alternate: null,
      Paymode: "BilltoCompany",
      Designation: profile1.Designation,
      CostCentre: null,
      RentalCity: null,
      CarModel: "Mini",
      PickupLocation: null,
      PickerupDate: new Date(),
      PickerupTime: new Date(),
      PickupType: null,
      Justification: null,
      DropLocation: null,
      DropDate: new Date(),
      DropTime: null,
      AdditionalInstructions: null,
      //Approver: profile.ApproverId,
      Manager: Manager,
      ManagerId: resultManager.data.Id,
      Approver: null,
      ApproverId: null
    })
    console.log("------------", values.DropTime)
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
        const dropDateTime = dayjs(dayjs(values.DropDate).format('YYYY/MM/DD') + ' ' + dayjs(values.DropTime).format('HH:mm'))
        const pickerupDateTime = dayjs(dayjs(values.PickerupDate).format('YYYY/MM/DD') + ' ' + dayjs(values.PickerupTime).format('HH:mm'))
        const now = dayjs()
        const diffHoursDrop = Math.abs(dayjs(dropDateTime).diff(dayjs(now), 'hour'));
        const dffHoursPickerup = Math.abs(dayjs(pickerupDateTime).diff(dayjs(now), 'hour'));
        const vaildpickupbefore = dayjs(pickerupDateTime).isBefore(dayjs(now));
        const vailddropbefore = dayjs(dropDateTime).isBefore(dayjs(now));


        if ((values.PickupType === "Local" && !vaildpickupbefore && dffHoursPickerup >= 3)) {
          setWaringMessage("")
          toggleShowAlert(false)
        } else if ((values.PickupType === "Outstation" && !vaildpickupbefore && dffHoursPickerup >= 24)) {
          setWaringMessage("")
          toggleShowAlert(false)
        }
        else {

          if (values.PickupType === "Local") { setWaringMessage("For local pick up, please book 3 hours in advance.") }
          if (values.PickupType === "Outstation") { setWaringMessage("Four outstation pick up, please book 24 hours in advance.") }
          return toggleShowAlert(true)
        }
        //const request = formToServer(values);
        //const user = await spfi(getSP()).web.siteUsers.getByEmail("group.spah.flow.mgmt@udtrucks.com")();
        // console.log(user)
        //console.log(values.Manager)

        const result: IWebEnsureUserResult = await sp.web.ensureUser("i:0#.f|membership|" + values.Email);
        const resultManager: IWebEnsureUserResult = await sp.web.ensureUser(values.Manager.LoginName);

        console.log(result); console.log(resultManager)

        console.log(values.PickerupDate)
        console.log(values.PickerupTime)
        //console.log(resultApprover)
        console.log(alternateValue + "alternate")
        console.log(showAlert + "showalert")
        //假设有Approver
        let request: any = {};
        if (alternateValue) {
          const resultApprover: IWebEnsureUserResult = await sp.web.ensureUser(values.Approver?.LoginName);
          request = {
            field_3: values.Email,
            Requester_x002a_Id: result.data.Id,
            //
            //Phone
            field_4: values.Phone,
            //Gender
            field_6: values.Gender,
            //AlternateApprover
            AlternateApprover: alternateValue,
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
            field_13: dayjs(values.PickerupDate).format('YYYY-MM-DD') + " " + dayjs(values.PickerupTime).format('HH:mm:ss'),
            //PickerupTime: undefined, 页面是两个 需要提交到一个框
            //PickupType
            field_9: values.PickupType,
            //Justification
            field_11: values.Justification,
            //DropLocation
            field_18: values.DropLocation,
            //DropDate + DropTime
            field_14: dayjs(values.DropDate).format('YYYY-MM-DD') + " " + dayjs(values.DropTime).format('HH:mm:ss'),
            //DropTime: undefined,
            //AdditionalInstructions
            field_20: values.AdditionalInstructions,
          }
          if (isEmpty(values.DropTime.toString)) { delete request.field_14 }
        } else if (!alternateValue) {
          request = {
            field_3: values.Email,
            Requester_x002a_Id: result.data.Id,
            //
            //Phone
            field_4: values.Phone,
            //Gender
            field_6: values.Gender,
            //AlternateApprover
            AlternateApprover: alternateValue,
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
            field_13: dayjs(values.PickerupDate).format('YYYY-MM-DD') + " " + dayjs(values.PickerupTime).format('HH:mm:ss'),
            //PickerupTime: undefined, 页面是两个 需要提交到一个框
            //PickupType
            field_9: values.PickupType,
            //Justification
            field_11: values.Justification,
            //DropLocation
            field_18: values.DropLocation,
            //DropDate + DropTime
            field_14: dayjs(values.DropDate).format('YYYY-MM-DD') + " " + dayjs(values.DropTime).format('HH:mm:ss'),
            //DropTime: undefined,
            //AdditionalInstructions
            field_20: values.AdditionalInstructions,
          }
          if (isEmpty(values.DropTime)) { delete request.field_14 }

        }
        console.log(request);
        console.log(values.DropTime)
        console.log("sss", isEmpty(values.DropTime))
        console.log(!showAlert)
        //if(resultApprover!==undefined){request[ApprovedById]= resultApprover.data.Id }
        if (request !== null) {
          addRequest({ request })
            .then(() => {
              //
              const returnUrl = window.location.href
              //document.location.href = "https://udtrucks.sharepoint.com/sites/app-RealEstateServiceDesk-QA/Lists/REIndia%20Taxi%20Request/AllItems.aspx"

              document.location.href = returnUrl.slice(0, returnUrl.indexOf("SitePage")) + "Lists/REIndia%20Taxi%20Request/AllItems.aspx"
            })
            .catch(() => {
              //
            });
        }
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
        <h1>Requester Information</h1>
      </section>
      <Stack horizontal tokens={stackTokens} styles={stackStyles}>
        <Stack {...columnProps}>
          <div className={styles.columnMaxHeight}>
            <TextField
              label="Requester Name"
              required
              name="Requestor"
              value={values.Requestor as string}
              onChange={(e) => {
                const v = (e.target as HTMLInputElement).value;
                setFieldValue('Requestor', v);
              }}
              errorMessage={errors.Requestor as string}
            />
          </div>
          <div className={styles.columnMaxHeight}>
            <TextField
              label="Phone Number"
              //type="number"
              name="Phone"
              required
              value={values.Phone as string}
              onChange={(e) => {
                const v = (e.target as HTMLInputElement).value;
                setFieldValue('Phone', v);
              }}
              errorMessage={errors.Phone as string}
            />
          </div>
          <div className={styles.columnMaxHeight}>
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
          </div>
          <div className={styles.columnMaxHeight}>
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
          </div><div className={styles.columnMaxHeight}>
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
          </div>
        </Stack>
        <Stack {...columnProps}>
          <div className={styles.columnMaxHeight}>
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
          </div>
          <div className={styles.columnMaxHeight}>
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
          </div>
          <div className={styles.columnMaxHeight}>
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
          </div>
          {/* 这个得是 people picker */}
          <div className={styles.columnMaxHeight}>
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
          </div><div className={styles.columnMaxHeight}>
            <TextField
              label="Cost Centre"
              value={values.CostCentre as string}
              onChange={(e) => {
                const v = (e.target as HTMLInputElement).value;
                setFieldValue('CostCentre', v);
              }}
              errorMessage={errors.CostCentre as string}
            />
          </div>
        </Stack>
      </Stack>
      <section>
        <h2>Booking Details</h2>
      </section>
      <Stack horizontal tokens={stackTokens} styles={stackStyles}>
        <Stack {...columnProps}>
          <div className={styles.columnMaxHeight}>
            <Dropdown
              placeholder="Select an option"
              label="Pickup Type"
              required
              // name="PickupType"
              options={pickupTypeOptions}
              selectedKey={[values.PickupType as string].filter(Boolean)}
              onChange={(e, option) => {
                setFieldValue('PickupType', option.key);
                if (option.key === "Local") { setFieldValue("RentalCity", "Bangalore") } else { setFieldValue("RentalCity", null) }
              }}
              errorMessage={errors.PickupType as string}
            />
          </div>
          <div className={styles.columnMaxHeight}>
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
                if (option.key === 'Innova Crysta' || option.key === 'Premium Cars') { setjustificationRequired(true) } else { setjustificationRequired(false) }
              }}
              errorMessage={errors.CarModel as string}
            />
          </div>
          <div className={styles.columnMaxHeight}>
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
          </div>
          <Stack
            styles={{ root: { width: 300 } }}
            horizontal
            tokens={{ childrenGap: 20 }}
          >
            <DatePicker
              style={{ width: 200 }}
              firstDayOfWeek={DayOfWeek.Sunday}
              label="Pickup Date"
              // name="PickerupDate"
              //isRequired
              value={values.PickerupDate as Date}
              onSelectDate={(date) => {
                setFieldValue('PickerupDate', date);
              }}
              strings={defaultDatePickerStrings}
            />
            <TimePicker
              label="Pickup Time"
              allowFreeform
              value={values.PickerupTime as Date}
              //required
              onChange={React.useCallback((e, time) => {


                if (time.toString() === "Invalid Date") { setFieldValue('PickerupTime', new Date()) } else {
                  setFieldValue('PickerupTime', time);
                }
              }, [])}
              style={{ width: 200 }}
            />
            {/* <TimePicker defaultValue={dayjs('12:08', format)} format={format} /> */}
          </Stack>
        </Stack>
        <Stack {...columnProps}>
          <div className={styles.columnMaxHeight}>
            <TextField
              label="Rental City"
              name="RentalCity"
              value={values.RentalCity as string}
              required
              onChange={(e) => {
                const v = (e.target as HTMLInputElement).value;
                setFieldValue('RentalCity', v);
              }}
              errorMessage={errors.RentalCity as string}
            />
          </div>
          <div className={styles.columnMaxHeight}>
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
          </div><div className={styles.columnMaxHeight}>
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
          </div>
          <Stack
            styles={{ root: { width: 300 } }}
            horizontal
            tokens={{ childrenGap: 20 }}
          >
            <DatePicker
              style={{ width: 200 }}
              firstDayOfWeek={DayOfWeek.Sunday}
              label="Drop Date"
              //isRequired
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
              //value={values.DropTime as Date}
              onChange={(e, time) => {
                if (time.toString() === "Invalid Date") { setFieldValue('DropTime', new Date()) } else {
                  setFieldValue('DropTime', time);
                }

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
        style={{ width: '650px', marginTop: 40, marginBottom: 20 }}
        horizontal
      >
        <Stack {...singleColumnProps} style={{ marginRight: 20 }}>
          {showAlert && (
            <MessageBar
              delayedRender={false}
              // Setting this to error, blocked, or severeWarning automatically sets the role to "alert"
              messageBarType={MessageBarType.error}
            // Or you could set the role manually, IF an alert role is appropriate for the message
            // role="alert"
            >
              {WaringMessage}
            </MessageBar>
          )}
        </Stack>
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
