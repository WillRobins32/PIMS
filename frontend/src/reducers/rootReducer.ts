import { combineReducers } from 'redux';
import parcelsReducer from 'reducers/parcelsReducer';
import lookupCodeReducer from 'reducers/lookupCodeReducer';
import * as reducerTypes from 'constants/reducerTypes';
import networkReducer from './networkReducer';
import accessRequestReducer from 'reducers/accessRequestReducer';
import usersReducer from './usersReducer';
import { loadingBarReducer } from 'react-redux-loading-bar';
import leafletMouseSlice from './LeafletMouseSlice';
import userDetailReducer from './userDetailReducer';
import jwtSlice from './JwtSlice';
import keycloakReadySlice from './keycloakReadySlice';
import mapViewZoomSlice from './mapViewZoomSlice';
import projectWorkflowSlice from 'features/projects/common/slices/projectWorkflowSlice';
import { ProjectReducers } from 'constants/reducerTypes';
import projectSlice from 'features/projects/common/slices/projectSlice';
import projectTasksSlice from 'features/projects/common/slices/projectTasksSlice';
import ProjectWorkflowTasksSlice from 'features/projects/common/slices/projectWorkflowTasksSlice';
import erpTabSlice from 'features/projects/erp/slices/erpTabSlice';
import splTabSlice from 'features/projects/spl/slices/splTabSlice';
import projectStatusesSlice from 'features/projects/common/slices/projectStatusesSlice';

export const reducerObject = {
  loadingBar: loadingBarReducer,
  [reducerTypes.PARCEL]: parcelsReducer,
  [reducerTypes.ACCESS_REQUEST]: accessRequestReducer,
  [reducerTypes.USERS]: usersReducer,
  [reducerTypes.GET_USER_DETAIL]: userDetailReducer,
  [reducerTypes.LOOKUP_CODE]: lookupCodeReducer,
  [reducerTypes.NETWORK]: networkReducer,
  [reducerTypes.LEAFLET_CLICK_EVENT]: leafletMouseSlice.reducer,
  [reducerTypes.JWT]: jwtSlice.reducer,
  [ProjectReducers.WORKFLOW]: projectWorkflowSlice.reducer,
  [ProjectReducers.WORKFLOW_TASKS]: ProjectWorkflowTasksSlice.reducer,
  [ProjectReducers.TASKS]: projectTasksSlice.reducer,
  [ProjectReducers.STATUSES]: projectStatusesSlice.reducer,
  [ProjectReducers.PROJECT]: projectSlice.reducer,
  [ProjectReducers.ERP_TAB]: erpTabSlice.reducer,
  [ProjectReducers.SPL_TAB]: splTabSlice.reducer,
  [reducerTypes.KEYCLOAK_READY]: keycloakReadySlice.reducer,
  [reducerTypes.MAP_VIEW_ZOOM]: mapViewZoomSlice.reducer,
};

export const rootReducer = combineReducers(reducerObject);

export type RootState = ReturnType<typeof rootReducer>;
