import * as React from 'react';
import styles from './TaxiRequest.module.scss';
import { ITaxiRequestProps } from './ITaxiRequestProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import { TextField } from '@fluentui/react/lib/TextField';
export default class TaxiRequest extends React.Component<ITaxiRequestProps, {}> {
  public render(): React.ReactElement<ITaxiRequestProps> {
   

    return (
      <div>
      <section>
      <h2>[RE India] - Taxi Request - New</h2>
      <br/>
      <h3>Requestor Information</h3>
      </section>
      <TextField label="Requestor Name"></TextField>
      <TextField label="Requestor Nam1" required={false}></TextField>
      {/* <Toggle label="Enabled and checked" defaultChecked onText="On" offText="Off" onChange={_onChange} /> */}
      </div>

    );
  }
}
