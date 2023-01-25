import { Action } from './actions';
import { Hit } from '~/components/Screens/AutoComplete';
import { User } from '~/components/AuthContainer';

export type CURRENCY = 'aed' | 'rmb' | 'eur' | 'sar' | 'usd' | 'rbl';

export interface AppState {
  propertyType: string;
  selectedHitID: string;
  amenity: string;
  currency: CURRENCY;
  searchType: string;
  prevSearchText: string;
  searchText: string;
  bedRooms: number;
  monthlyRent: number;
  filter: string;
  hit: Hit;
  visibleMobileFooter: boolean;
  fbToken: string;
  fbRefreshToken: string;
  user: User;
  rates: {
    AED: number;
    USD: number;
    EUR: number;
    SAR: number;
    CNY: number;
  };
}

export const initialState: AppState = {
  propertyType: '',
  selectedHitID: '',
  amenity: '',
  currency: 'aed',
  searchType: 'buy',
  prevSearchText: '',
  searchText: '',
  bedRooms: 0,
  monthlyRent: 100000,
  filter: '',
  hit: null,
  visibleMobileFooter: true,
  fbToken: '',
  fbRefreshToken: '',
  user: null,
  rates: null,
};

export const appReducer = (state: AppState = initialState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case Action.SET_PROPERTYTYPE: {
      return { ...state, propertyType: action.payload };
    }
    case Action.SET_SELETEDHITID: {
      return { ...state, selectedHitID: action.payload };
    }
    case Action.SET_AMENITY: {
      return { ...state, amenity: action.payload };
    }
    case Action.SET_CURRENCY: {
      return { ...state, currency: action.payload };
    }
    case Action.SET_RATES: {
      return { ...state, rates: action.payload };
    }
    case Action.SET_SEARCHTYPE: {
      return { ...state, searchType: action.payload };
    }
    case Action.SET_PREV_SEARCH_TEXT: {
      return { ...state, prevSearchText: action.payload };
    }
    case Action.SET_SEARCH_TEXT: {
      return { ...state, searchText: action.payload };
    }
    case Action.SET_BEDROOMS: {
      return { ...state, bedRooms: action.payload };
    }
    case Action.SET_MONTHLYRENT: {
      return { ...state, monthlyRent: action.payload };
    }
    case Action.SET_FILTER: {
      return { ...state, filter: action.payload };
    }
    case Action.SET_HIT: {
      return { ...state, hit: action.payload };
    }
    case Action.SET_VISIBLE_MOBILE_FOOTER: {
      return { ...state, visibleMobileFooter: action.payload };
    }
    case Action.SET_FBTOKEN: {
      return { ...state, fbToken: action.payload };
    }
    case Action.SET_FBREFRESHTOKEN: {
      return { ...state, fbRefreshToken: action.payload };
    }
    case Action.SET_USER: {
      return { ...state, user: action.payload };
    }
    default:
      return state;
  }
};
