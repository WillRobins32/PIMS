import { Fragment, useCallback } from 'react';
import React from 'react';
import { FormikProps, getIn } from 'formik';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import _ from 'lodash';
import * as API from 'constants/API';
import { Form, FastInput, Select, AutoCompleteText, SelectOption } from 'components/common/form';
import { mapLookupCode } from 'utils';
import { IAddress } from 'actions/parcelsActions';
import { GeocoderAutoComplete } from '../../GeocoderAutoComplete';
import { IGeocoderResponse } from 'hooks/useApi';

interface AddressProps {
  nameSpace?: string;
  disabled?: boolean;
  onGeocoderChange?: (data: IGeocoderResponse) => void;
}

export const defaultAddressValues: IAddress = {
  line1: '',
  line2: undefined,
  city: undefined,
  cityId: '',
  province: undefined,
  provinceId: 'BC',
  postal: '',
};
const AddressForm = <T extends any>(props: AddressProps & FormikProps<T>) => {
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const provinces = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.PROVINCE_CODE_SET_NAME;
  }).map(mapLookupCode);
  const cities = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.CITY_CODE_SET_NAME;
  }).map(mapLookupCode);

  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return props.nameSpace ? `${props.nameSpace}.${fieldName}` : fieldName;
    },
    [props.nameSpace],
  );

  const handleGeocoderChanges = (data: IGeocoderResponse) => {
    if (data && props.onGeocoderChange) {
      props.onGeocoderChange(data);
    }
  };

  /**
   * postalCodeFormatter takes the specified postal code and formats it with a space in the middle
   * @param {string} postal The target postal to be formatted
   */
  const postalCodeFormatter = (postal: string) => {
    const regex = /([a-zA-z][0-9][a-zA-z])[\s-]?([0-9][a-zA-z][0-9])/;
    const format = postal.match(regex);
    if (format !== null && format.length === 3) {
      postal = `${format[1]} ${format[2]}`;
    }
    return postal.toUpperCase();
  };

  return (
    <Fragment>
      <div className="addressForm">
        <Form.Row>
          <Form.Label column md={2}>
            Street Address
          </Form.Label>
          <GeocoderAutoComplete
            value={getIn(props.values, withNameSpace('line1'))}
            disabled={props.disabled}
            field={withNameSpace('line1')}
            onSelectionChanged={handleGeocoderChanges}
            onTextChange={value => props.setFieldValue(withNameSpace('line1'), value)}
            error={getIn(props.errors, withNameSpace('line1'))}
            touch={getIn(props.touched, withNameSpace('line1'))}
          />
        </Form.Row>
        <Form.Row>
          <Form.Label column md={2}>
            City
          </Form.Label>
          <AutoCompleteText
            autoSetting="new-password"
            getValueDisplay={(val: SelectOption) => val.label}
            field={withNameSpace('cityId')}
            options={cities}
            disabled={props.disabled}
            required={true}
          />
        </Form.Row>
        <Form.Row>
          <Form.Label column md={2}>
            Province
          </Form.Label>
          <Select
            disabled={true}
            outerClassName="col-md-10"
            placeholder="Must Select One"
            field={withNameSpace('provinceId')}
            options={provinces}
          />
        </Form.Row>
        <Form.Row>
          <Form.Label column md={2}>
            Postal
          </Form.Label>
          <FastInput
            formikProps={props}
            disabled={props.disabled}
            outerClassName="col-md-10"
            onBlurFormatter={(postal: string) =>
              postal.replace(postal, postalCodeFormatter(postal))
            }
            field={withNameSpace('postal')}
          />
        </Form.Row>
      </div>
    </Fragment>
  );
};

export default AddressForm;
