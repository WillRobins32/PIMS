import * as React from 'react';
import FilterBar from 'components/SearchBar/FilterBar';
import { Col } from 'react-bootstrap';
import { Input, SelectOption, Select } from 'components/common/form';
import { ILookupCode } from 'actions/lookupActions';
import { IUsersFilter } from 'interfaces';

interface IProps {
  value: IUsersFilter;
  agencyLookups: ILookupCode[];
  rolesLookups: ILookupCode[];
  onChange: (value: IUsersFilter) => void;
}

export const UsersFilterBar: React.FC<IProps> = ({
  value,
  agencyLookups,
  rolesLookups,
  onChange,
}) => {
  const agencyOptions = agencyLookups.map(
    al => ({ label: al.name, value: al.name } as SelectOption),
  );
  const roleOptions = rolesLookups.map(rl => ({ label: rl.name, value: rl.name } as SelectOption));

  return (
    <FilterBar<IUsersFilter> initialValues={value} onChange={onChange}>
      <Col className="bar-item">
        <Input field="username" placeholder="IDIR/BCeID" />
      </Col>
      <Col className="bar-item">
        <Input field="firstName" placeholder="First name" />
      </Col>
      <Col className="bar-item">
        <Input field="lastName" placeholder="Last name" />
      </Col>
      <Col className="bar-item">
        <Input field="email" placeholder="Email" />
      </Col>
      <Col className="bar-item">
        <Input field="position" placeholder="Position" />
      </Col>
      <Col className="bar-item">
        <Select field="agency" placeholder="Agency" options={agencyOptions} />
      </Col>
      <Col className="bar-item">
        <Select field="role" placeholder="Role" options={roleOptions} />
      </Col>
    </FilterBar>
  );
};
