import {
  SUBMIT_PAPER_REQUEST,
  SUBMIT_PAPER_SUCCESS,
  SUBMIT_PAPER_FAIL,
  CLEAR_PAPER_ERRORS,
} from '../constants/paperConstants';

const initialState = {
  loading: false,
  success: false,
  error: null,
  paper: null,
};

export const paperReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_PAPER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case SUBMIT_PAPER_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        paper: action.payload,
      };
    case SUBMIT_PAPER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_PAPER_ERRORS:
      return {
        ...state,
        error: null,
        success: false,
      };
    default:
      return state;
  }
};
