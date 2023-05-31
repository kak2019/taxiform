import * as React from "react";
import styles from "./TaxiRequest.module.scss";
import { ITaxiRequestProps } from "./ITaxiRequestProps";
import { TextField } from "@fluentui/react/lib/TextField";
import { Stack, IStackProps, IStackStyles } from "@fluentui/react/lib/Stack";
import {
  Dropdown,
  Toggle,
  defaultDatePickerStrings,
  DatePicker,
  DayOfWeek,
  TimePicker,
} from "@fluentui/react";
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react";

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

export default class TaxiRequest extends React.Component<
  ITaxiRequestProps,
  {}
> {
  public render(): React.ReactElement<ITaxiRequestProps> {
    return (
      <div>
        <section>
          <h2>[RE India] - Taxi Request - New</h2>
          <br />
          <h3>Requestor Information</h3>
        </section>
        <Stack horizontal tokens={stackTokens} styles={stackStyles}>
          <Stack {...columnProps}>
            <TextField label="Requestor Name" required />
            <TextField label="Phone Number" prefix="+86" type="number" />
            <Dropdown
              placeholder="Select an option"
              label="Gender"
              required
              options={[{ key: "apple", text: "Apple" }]}
            />
            <Toggle
              label="Alternate Approver"
              defaultChecked
              onText="On"
              offText="Off"
              style={{ marginBottom: 4 }}
            />
            <Dropdown
              placeholder="Select an option"
              label="Paymode"
              required
              options={[{ key: "apple", text: "Apple" }]}
            />
          </Stack>
          <Stack {...columnProps}>
            <TextField label="Email" required readOnly />
            <TextField label="Designation" />
            <Dropdown
              placeholder="Select an option"
              label="Manager"
              required
              options={[{ key: "apple", text: "Apple" }]}
            />
            <Dropdown
              placeholder="Select an option"
              label="Approver"
              required
              options={[{ key: "apple", text: "Apple" }]}
            />
            <TextField label="Cost Center" />
          </Stack>
        </Stack>
        <section>
          <h3>Booking Details</h3>
        </section>
        <Stack horizontal tokens={stackTokens} styles={stackStyles}>
          <Stack {...columnProps}>
            <TextField label="Rental City" />
            <Dropdown
              placeholder="Select an option"
              label="Car Type"
              required
              options={[{ key: "apple", text: "Apple" }]}
            />
            <TextField label="Pickup Location" required />
            <Stack
              styles={{ root: { width: 300 } }}
              horizontal
              tokens={{ childrenGap: 20 }}
            >
              <DatePicker
                style={{ width: 200 }}
                firstDayOfWeek={DayOfWeek.Sunday}
                label="Pickerup Date"
                strings={defaultDatePickerStrings}
              />
              <TimePicker label="Pickerup Time" style={{ width: 200 }} />
            </Stack>
          </Stack>
          <Stack {...columnProps}>
            <Dropdown
              placeholder="Select an option"
              label="Pickup Type"
              required
              options={[{ key: "apple", text: "Apple" }]}
            />
            <TextField label="Justification" />
            <TextField label="Drop Location" />
            <Stack
              styles={{ root: { width: 300 } }}
              horizontal
              tokens={{ childrenGap: 20 }}
            >
              <DatePicker
                style={{ width: 200 }}
                firstDayOfWeek={DayOfWeek.Sunday}
                label="Drop Date"
                strings={defaultDatePickerStrings}
              />
              <TimePicker label="Drop Time" style={{ width: 200 }} />
            </Stack>
          </Stack>
        </Stack>
        <Stack horizontal tokens={stackTokens} styles={stackStyles}>
          <Stack {...singleColumnProps}>
            <TextField label="Additional Instruction" multiline />
          </Stack>
        </Stack>

        <Stack
          enableScopedSelectors
          horizontalAlign="end"
          style={{ paddingRight: 100, marginTop: 40, marginBottom: 20 }}
          horizontal
        >
          <PrimaryButton
            text="Submit"
            allowDisabledFocus
            style={{ marginRight: 24 }}
          />
          <DefaultButton text="Standard" allowDisabledFocus />
        </Stack>
      </div>
    );
  }
}
