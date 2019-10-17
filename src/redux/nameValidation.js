// @flow
import {createRPCReducer} from 'fusion-plugin-rpc-redux-react';

const initialState = {
  loading: false,
  data: {},
  error: null,
};
export default createRPCReducer(
  'getNameValidities',
  {
    start: (state, action) => ({...state, loading: true}),
    success: (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    },
    failure: (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };
    },
  },
  initialState
);
