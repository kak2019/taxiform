import * as React from 'react';

import { spfi, PrincipalType, PrincipalSource, IPrincipalInfo } from '@pnp/sp';
/* Kendo */
import { TagPicker } from 'office-ui-fabric-react/lib/components/pickers/TagPicker/TagPicker';
import { getSP } from '../pnpjsConfig';
import { Label } from '@fluentui/react';
/* Mobx */
interface IPeoplePickerProps {
  defaultValue?: any;
  defaultText?: any;
  value?: any;
  onChange: any;
  required?: boolean;
  label?: string;
  errorMessage?: string;
}
interface IPeoplePickerState {
  preselectedItems: any;
  dataSource: any;
}

const PeoplePicker = class PeoplePickerClass extends React.Component<
  IPeoplePickerProps,
  IPeoplePickerState
> {
  constructor(props: IPeoplePickerProps) {
    super(props);
    const { defaultValue } = props;
    this.state = {
      dataSource: [],
      preselectedItems: defaultValue ? [defaultValue] : [],
    };
  }

  public componentWillMount() {
    const defaultValue = this.props.defaultValue;
    const defaultText = this.props.defaultText;
    if (defaultValue && defaultText) {
      this.setState({
        preselectedItems: [
          {
            key: defaultValue,
            name: defaultText,
          },
        ],
      });
    }
  }

  public filterItems = (text: string): Promise<any> => {
    if (text === '') {
      return null;
    }
    return spfi(getSP())
      .utility.searchPrincipals(
        text,
        PrincipalType.User,
        PrincipalSource.All,
        '',
        20,
      )
      .then((principals: IPrincipalInfo[] | any) => {
        console.log('principals', principals);
        return principals.reduce((filtered: any, principal: any) => {
          filtered.push({
            key: principal.LoginName,
            name: `${principal.DisplayName} (${principal.JobTitle})`,
            displayName: principal.DisplayName,
          });
          return filtered as Promise<any>;
        }, []);
      });
  };

  public onPersonSelected = (input: any[]) => {
    if (input.length > 0) {
      const person = input[0];
      this.props.onChange({
        LoginName: person.key,
        DisplayName: person.displayName,
      });
    } else {
      this.props.onChange();
    }
  };

  public render(): JSX.Element {
    return (
      <div>
        <Label className="headerColumn" required={this.props.required}>
          {this.props.label}
        </Label>

        <TagPicker
          itemLimit={1}
          pickerSuggestionsProps={{
            suggestionsHeaderText: 'People you may looking for',
            noResultsFoundText: 'No people found',
          }}
          onChange={this.onPersonSelected}
          onResolveSuggestions={(text) => this.filterItems(text)}
          defaultSelectedItems={this.state.preselectedItems}
        />

        {this.props.errorMessage ? (
          <Label
            className="headerColumn"
            style={{ color: 'rgb(164, 38, 44)', fontSize: 12, fontWeight: 400 }}
          >
            {this.props.errorMessage}
          </Label>
        ) : null}
      </div>
    );
  }
};

export default PeoplePicker;
