export const minQuantity = 0;

export const maxQuantity = 10;

export const maxMonthlyRent = 100000;

export const defaultAmenities = [
  {
    title: "Freehold",
    active: false
  },
  {
    title: "Furnished",
    active: false
  },
  {
    title: "Cleaning Services",
    active: false
  },
  {
    title: "Maintenance Staff",
    active: false
  },
  {
    title: "Conference Room",
    active: false
  },
  {
    title: "Balcony",
    active: false
  },
  {
    title: "Terrace",
    active: false
  },
  {
    title: "Jacuzzi",
    active: false
  },
  {
    title: "Sauna",
    active: false
  },
  {
    title: "Steam Room",
    active: false
  },
  {
    title: "Lobby",
    active: false
  },
  {
    title: "Gym",
    active: false
  },
  {
    title: "Study Room",
    active: false
  },
  {
    title: "Swimming Pool",
    active: false
  },
  {
    title: "Garden",
    active: false
  },
  {
    title: "Barbecue Area",
    active: false
  },
  {
    title: "Convenient Waste Disposal",
    active: false
  },
  {
    title: "Security Staff",
    active: false
  },
  {
    title: "CCTV",
    active: false
  },
  {
    title: "Satellite/Cable TV",
    active: false
  },
  {
    title: "Intercom",
    active: false
  },
  {
    title: "24h Concierge",
    active: false
  },
  {
    title: "Central Air-conditioning",
    active: false
  }
];

export const defaultCities = ['Dubai', 'Abu Dhabi', 'Ajman', 'Sharjah', 'Fujairah', 'Um Al Quwain', 'Ras Al Khaimah'];

export const defaultStates = ['Dubai', 'Abu Dhabi', 'Ajman', 'Sharjah', 'Fujairah', 'Um Al Quwain', 'Ras Al Khaimah'];

export const propertyTypes = ["Apartment", "Townhouse", "Villa", "Hotel Apartment", "Penthouse", "Water Home"];

export const mapStyles = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
];

export const listingTypes = ['buy', 'rent'];

export const amountTypes = ['monthly', 'bi-monthly', 'quarterly', 'yearly', 'onetime'];

export const defaultCountry = 'United Arab Emirates';

export const maxImageWidth = 6000;

export const maxImageHeight = 8000;

export const maxFileSize = 40000000

export const ROLE = {
  ADMIN: 'admin',
  AGENT: 'agent',
  OWNER: 'owner',
  TENANT: 'tenant',
  BUYER: 'buyer'
}

export const DEFAULT_CURRENCY ='aed';

export const CAREER_LINK = 'https://career.recom.estate';
export const HELP_CENTER_LINK = 'https://help.recom.estate/';
export const INSTAGRAM_LINK = 'https://www.instagram.com/recom.estate';
export const FACEBOOK_LINK = 'https://www.facebook.com/recomestate';
export const LINKEDIN_LINK = 'https://www.linkedin.com/company/recomestate';
export const TWITTER_LINK = 'https://twitter.com/recomestate';
export const YOUTUBE_LINK = 'https://www.youtube.com/c/recomestate';
export const GOOGLE_PLAY_LINK = 'https://play.google.com/store/apps/details?id=estate.recom.app';
export const APP_STORE_LINK = 'https://apps.apple.com/us/app/recom/id1602364395';
