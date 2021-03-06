import React, { useEffect, useState } from 'react';
import Map, { MapViewportChangeEvent } from '../../../components/maps/leaflet/Map';
import './MapView.scss';
import { getFetchLookupCodeAction } from 'actionCreators/lookupCodeActionCreator';
import { fetchParcels, fetchPropertyDetail } from 'actionCreators/parcelsActionCreator';
import { IPropertySearchParams } from 'constants/API';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IProperty, storeParcelDetail, IPropertyDetail } from 'actions/parcelsActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import { ILookupCode } from 'actions/lookupActions';
import { LeafletMouseEvent } from 'leaflet';
import {
  saveClickLatLng as saveLeafletMouseEvent,
  clearClickLatLng,
} from 'reducers/LeafletMouseSlice';
import * as API from 'constants/API';
import _ from 'lodash';

const parcelBounds: IPropertySearchParams = {
  pid: null,
  neLatitude: 48.43,
  neLongitude: -123.37,
  swLatitude: 48.43,
  swLongitude: -123.37,
  address: null,
  municipality: null,
  projectNumber: null,
  agencies: null,
  classificationId: null,
  minLandArea: null,
  maxLandArea: null,
  inSurplusPropertyProgram: false,
};

// This could also come from the API, a local file, etc -OR- replacing the <select> fields with free text inputs.
// Hard-coding it here until further requirements say otherwise.
const fetchLotSizes = () => {
  return [1, 2, 5, 10, 50, 100, 200, 300, 400, 500, 1000, 10000];
};

interface MapViewProps {
  disableMapFilterBar?: boolean;
  disabled?: boolean;
  showParcelBoundaries?: boolean;
  onMarkerClick?: (obj: IProperty) => void;
  onMarkerPopupClosed?: (obj: IPropertyDetail) => void;
  /** to avoid the marker disappearing while zooming in the process of submitting a property */
  submittingProperty?: boolean;
}

const MapView: React.FC<MapViewProps> = (props: MapViewProps) => {
  const properties = useSelector<RootState, IProperty[]>(state => state.parcel.parcels);
  const [loadedProperties, setLoadedProperties] = useState(false);
  const propertyDetail = useSelector<RootState, IPropertyDetail | null>(
    state => state.parcel.parcelDetail,
  );
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const agencies = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.AGENCY_CODE_SET_NAME;
  });
  const propertyClassifications = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.PROPERTY_CLASSIFICATION_CODE_SET_NAME && !!lookupCode.isVisible;
  });

  const lotSizes = fetchLotSizes();
  const dispatch = useDispatch();

  const getApiParams = (e: MapViewportChangeEvent): IPropertySearchParams | null => {
    if (!e || !e.bounds) {
      return null;
    }
    const {
      pid,
      address,
      municipality,
      projectNumber,
      agencies,
      classificationId,
      minLotSize,
      maxLotSize,
      inSurplusPropertyProgram,
      inEnhancedReferralProcess,
    } = e.filter ?? {};

    const ne = e.bounds.getNorthEast();
    const sw = e.bounds.getSouthWest();
    const apiParams: IPropertySearchParams = {
      pid: pid ?? null,
      neLatitude: ne.lat,
      neLongitude: ne.lng,
      swLatitude: sw.lat,
      swLongitude: sw.lng,
      address: address ?? null,
      municipality: municipality ?? null,
      projectNumber: projectNumber ?? null,
      agencies: agencies ?? null,
      classificationId: classificationId ?? null,
      minLandArea: minLotSize ?? null,
      maxLandArea: maxLotSize ?? null,
      inSurplusPropertyProgram: inSurplusPropertyProgram ?? null,
      inEnhancedReferralProcess,
    };
    return apiParams;
  };
  const saveLatLng = (e: LeafletMouseEvent) => {
    // TODO: this prevents click events on markers from being recorded, would like a better way.
    if (!(e?.originalEvent?.target as any)?.className.indexOf('leaflet-marker')) {
      return;
    }
    if (!props.disabled) {
      dispatch(saveLeafletMouseEvent(e));
    }
  };

  useEffect(() => {
    dispatch(fetchParcels(parcelBounds));
    dispatch(getFetchLookupCodeAction());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearClickLatLng());
    };
  }, [dispatch]);

  return (
    <Map
      lat={(propertyDetail?.parcelDetail?.latitude as number) ?? 48.43}
      lng={(propertyDetail?.parcelDetail?.longitude as number) ?? -123.37}
      properties={properties}
      selectedProperty={propertyDetail}
      agencies={agencies}
      propertyClassifications={propertyClassifications}
      lotSizes={lotSizes}
      onMarkerClick={
        props.onMarkerClick ??
        ((p, position) => p.id && dispatch(fetchPropertyDetail(p.id, p.propertyTypeId, position)))
      }
      onMarkerPopupClose={props.onMarkerPopupClosed ?? (() => dispatch(storeParcelDetail(null)))}
      onViewportChanged={(mapFilterModel: MapViewportChangeEvent) => {
        if (!props.submittingProperty) {
          const apiParams = getApiParams(mapFilterModel);
          const action = fetchParcels(apiParams);
          _.throttle(() => {
            dispatch(action);
          }, 250)();
        } else {
          if (!loadedProperties) {
            const apiParams = getApiParams(mapFilterModel);
            const action = fetchParcels(apiParams);
            _.throttle(() => {
              dispatch(action);
            }, 250)();
            setLoadedProperties(true);
          }
        }
      }}
      onMapClick={saveLatLng}
      disableMapFilterBar={props.disableMapFilterBar}
      interactive={!props.disabled}
      showParcelBoundaries={props.showParcelBoundaries ?? true}
    />
  );
};

export default MapView;
