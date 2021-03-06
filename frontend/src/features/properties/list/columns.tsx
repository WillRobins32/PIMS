import BuildingSvg from 'assets/images/icon-business.svg';
import LandSvg from 'assets/images/icon-lot.svg';

import React from 'react';
import { CellProps } from 'react-table';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatMoney, formatNumber } from 'utils';
import { IProperty } from '.';
import { ColumnWithProps } from 'components/Table';

const MoneyCell = ({ cell: { value } }: CellProps<IProperty, number>) => formatMoney(value);

const NumberCell = ({ cell: { value } }: CellProps<IProperty, number>) => formatNumber(value);

// NOTE - There numbers below match the total number of columns ATM (13)
// If additional columns are added or deleted, these numbers need tp be updated...
const howManyColumns = 13;
const totalWidthPercent = 100; // how wide the table should be; e.g. 100%

// Setup a few sample widths: x/2, 1x, 2x (percentage-based)
const unit = Math.floor(totalWidthPercent / howManyColumns);
const spacing = {
  xxsmall: 1,
  xsmall: unit / 4,
  small: unit / 2,
  medium: unit,
  large: unit * 2,
  xlarge: unit * 4,
  xxlarge: unit * 8,
};

export const columns: ColumnWithProps<IProperty>[] = [
  {
    Header: 'Agency',
    accessor: 'agencyCode', // accessor is the "key" in the data
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 65, // px
  },
  {
    Header: 'Sub Agency',
    accessor: 'subAgency',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Property Name',
    accessor: 'description',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Classification',
    accessor: 'classification',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Street Address',
    accessor: 'address',
    align: 'left',
    responsive: true,
    width: spacing.large,
    minWidth: 160,
  },
  {
    Header: 'City',
    accessor: 'city',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Municipality',
    accessor: 'municipality',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Assessed Value',
    accessor: 'assessed',
    Cell: MoneyCell,
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Netbook Value',
    accessor: 'netBook',
    Cell: MoneyCell,
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Estimated Value',
    accessor: 'estimated',
    Cell: MoneyCell,
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'Type',
    accessor: 'propertyTypeId',
    Cell: ({ cell: { value } }: CellProps<IProperty, number>) => {
      const icon = value === 0 ? LandSvg : BuildingSvg;
      return <Image src={icon} />;
    },
    responsive: true,
    width: spacing.small,
    minWidth: 65,
  },
  {
    Header: 'Lot Size (in ha)',
    accessor: 'landArea',
    Cell: NumberCell,
    responsive: true,
    width: spacing.small,
    minWidth: 65,
  },
  {
    Header: ' ',
    id: 'view-link-column',
    responsive: true,
    width: spacing.small,
    minWidth: 65,
    accessor: row => {
      // Return the parcel ID associated with this row.
      // For buildings we need the parent `parcelId` property
      const id = row.propertyTypeId === 0 ? row.id : row.parcelId;
      return id ?? -1;
    },
    Cell: ({ cell: { value } }: CellProps<IProperty, number>) => {
      if (value > 0) {
        return <Link to={`/submitProperty/${value}?disabled=true`}>View</Link>;
      }
      return null;
    },
  },
];
