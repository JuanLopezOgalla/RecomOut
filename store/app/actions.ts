import { Hit } from '~/components/Screens/AutoComplete';
import { User } from '~/components/AuthContainer';
import { CURRENCY } from '.';

export enum Action {
  SET_PROPERTYTYPE = 'SET_PROPERTYTYPE',
  SET_SELETEDHITID = 'SET_SELETEDHITID',
  SET_AMENITY = 'SET_AMENITY',
  SET_CURRENCY = 'SET_CURRENCY',
  SET_SEARCHTYPE = 'SET_SEARCHTYPE',
  SET_PREV_SEARCH_TEXT = 'SET_PREV_SEARCH_TEXT',
  SET_SEARCH_TEXT = 'SET_SEARCH_TEXT',
  SET_BEDROOMS = 'SET_BEDROOMS',
  SET_MONTHLYRENT = 'SET_MONTHLYRENT',
  SET_FILTER = 'SET_FILTER',
  SET_HIT = 'SET_HIT',
  SET_VISIBLE_MOBILE_FOOTER = 'SET_VISIBLE_MOBILE_FOOTER',
  SET_FBTOKEN = 'SET_FBTOKEN',
  SET_FBREFRESHTOKEN = 'SET_FBREFRESHTOKEN',
  SET_USER = 'SET_USER',
  SET_RATES = 'SET_RATES',
}

export const setPropertyType = (propertyType: string) => ({
  type: Action.SET_PROPERTYTYPE,
  payload: propertyType,
});

export const setSelectedHitID = (selectedHitID: string) => ({
  type: Action.SET_SELETEDHITID,
  payload: selectedHitID,
});

export const setAmenity = (amenity: string) => ({
  type: Action.SET_AMENITY,
  payload: amenity,
});

export const setCurrency = (currency: CURRENCY) => ({
  type: Action.SET_CURRENCY,
  payload: currency,
});

export const setRates = (rates: { AED: number; USD: number; EUR: number; SAR: number; CNY: number }) => ({
  type: Action.SET_RATES,
  payload: rates,
});

export const setSearchType = (searchType: string) => ({
  type: Action.SET_SEARCHTYPE,
  payload: searchType,
});

export const setPrevSearchText = (prevSearchText: string) => ({
  type: Action.SET_PREV_SEARCH_TEXT,
  payload: prevSearchText,
});

export const setSearchText = (searchText: string) => ({
  type: Action.SET_SEARCH_TEXT,
  payload: searchText,
});

export const setBedRooms = (bedRooms: number) => ({
  type: Action.SET_BEDROOMS,
  payload: bedRooms,
});

export const setMonthlyRent = (monthlyRent: number) => ({
  type: Action.SET_MONTHLYRENT,
  payload: monthlyRent,
});

export const setFilter = (filter: string) => ({
  type: Action.SET_FILTER,
  payload: filter,
});

export const setHit = (hit: Hit) => ({
  type: Action.SET_HIT,
  payload: hit,
});

export const setVisibleMobileFooter = (visibleMobileFooter: boolean) => ({
  type: Action.SET_VISIBLE_MOBILE_FOOTER,
  payload: visibleMobileFooter,
});

export const setFbToken = (fbToken: string) => ({
  type: Action.SET_FBTOKEN,
  payload: fbToken,
});

export const setFbRefreshToken = (fbRefreshToken: string) => ({
  type: Action.SET_FBREFRESHTOKEN,
  payload: fbRefreshToken,
});

export const setUser = (user: User) => ({
  type: Action.SET_USER,
  payload: user,
});
