import React, { useState } from 'react';
import { Col, Button } from 'react-bootstrap';
import { FieldArray, useFormikContext, FormikProps, getIn } from 'formik';
import BuildingForm, { defaultBuildingValues, IFormBuilding } from './BuildingForm';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { IFormParcel } from '../ParcelDetailForm';
import WrappedPaginate from 'components/common/WrappedPaginate';
import _ from 'lodash';
import { IPaginate } from 'utils/CommonFunctions';
import PaginatedFormErrors from './PaginatedFormErrors';

interface PagedBuildingFormsProps {
  /** controls whether this form can be interacted with */
  disabled?: boolean;
  allowEdit?: boolean;
}
const NUMBER_OF_EVALUATIONS_PER_PAGE = 1;

/**
 * Get the paginated page numbers that contain errors.
 */
const getPageErrors = (errors: any, nameSpace: any) => {
  const buildingErrors = getIn(errors, nameSpace);
  return _.reduce(
    buildingErrors,
    (acc: number[], error, index) => {
      if (error) {
        acc.push(parseInt(index) + 1);
      }
      return acc;
    },
    [],
  );
};

/**
 * PagedBuildingForms paginates all buildings within props.values.buildings.
 * @param props
 */
const PagedBuildingForms: React.FC<PagedBuildingFormsProps> = (props: PagedBuildingFormsProps) => {
  const formikProps: FormikProps<IFormParcel> = useFormikContext();
  const buildings: IFormBuilding[] = getIn(formikProps.values, 'buildings');

  const pagedBuildings: IPaginate = {
    page: 0,
    total: buildings.length,
    quantity: NUMBER_OF_EVALUATIONS_PER_PAGE,
    items: _.range(0, buildings.length),
    maxPages: 15,
  };
  // the current paginated page.
  const [currentPage, setCurrentPage] = useState<number>(0);

  return (
    <Col>
      <h3>Buildings</h3>
      <FieldArray
        name="buildings"
        render={arrayHelpers => (
          <div>
            <span className="buildingPaginate">
              {!props.disabled && !!props.allowEdit && (
                <>
                  <Button
                    className="pagedBuildingButton page-link"
                    variant="link"
                    disabled={props.disabled}
                    title="Add Building"
                    onClick={() =>
                      arrayHelpers.push({
                        ...defaultBuildingValues,
                        address: {
                          line1: formikProps.values.address?.line1,
                          line2: formikProps.values.address?.line2,
                          city: formikProps.values.address?.city,
                          cityId: formikProps.values.address?.cityId,
                          province: formikProps.values.address?.province,
                          provinceId: 'BC',
                          postal: formikProps.values.address?.postal,
                        },
                        latitude: formikProps.values.latitude,
                        longitude: formikProps.values.longitude,
                      })
                    }
                  >
                    <FaPlus size={14} />
                  </Button>
                  <Button
                    className="pagedBuildingButton page-link"
                    disabled={!buildings.length}
                    variant="link"
                    title="Remove Building"
                    onClick={() => {
                      if (currentPage === buildings.length - 1) {
                        setCurrentPage(currentPage - 1);
                      }
                      arrayHelpers.remove(currentPage);
                    }}
                  >
                    <FaTrash size={14} />
                  </Button>
                </>
              )}

              <WrappedPaginate
                onPageChange={(page: any) => setCurrentPage(page.selected)}
                {...pagedBuildings}
              />
            </span>
            {!!formikProps.values.buildings.length && <h4>Building Information</h4>}
            <PaginatedFormErrors
              errors={getPageErrors(formikProps.errors, 'buildings')}
              nameSpace="Buildings"
            />
            <div>
              {!!buildings.length && (
                <BuildingForm
                  {...(formikProps as any)}
                  disabled={props.disabled}
                  allowEdit={props.allowEdit}
                  nameSpace="buildings"
                  index={currentPage}
                />
              )}
            </div>
          </div>
        )}
      />
    </Col>
  );
};

export default PagedBuildingForms;
