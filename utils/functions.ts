import { Country, City }  from 'country-state-city';
import { getCode } from 'country-list';
import axios from 'axios';
import { Hit } from '~/components/Screens/AutoComplete';

export const getRates = async (baseCurrency: string) => {
    const response = await axios({ method: 'get', url: `https://api.exchangerate.host/latest?base=${baseCurrency === 'rmb' ? 'CNY' : baseCurrency}` });

    if (response.status === 200) {
        const rates = {
            AED: response.data.rates.AED,
            SAR: response.data.rates.SAR,
            USD: response.data.rates.USD,
            EUR: response.data.rates.EUR,
            CNY: response.data.rates.CNY,
            RUB: response.data.rates.RUB
        };
        
        return rates;
    }

    return null;
};

const getPosition = () => {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
}

export const cls = (styles) => {
    return styles.join(" ").trim();
};

export const getDateOfToday = () => {
    const today = new Date();

    return `${today.getFullYear()}-${formatDateNumber(today.getMonth() + 1)}-${formatDateNumber(today.getDate())}`;
};

export const formatDateNumber = (number: number) => {
    return number < 10 ? `0${number}` : number;
};

export const getTimeArray = () => {
    let day = new Date();
    
    day.setHours(0,0,0,0);

    const date = day.getDate();
    let timeArr = [];
    
    while ( date === day.getDate() )
    {
        let hours = day.getHours();
        let ampm = "am";

        hours = hours === 0 ? 12: hours;
        ampm = hours > 12 ? "pm": "am";
        hours = hours > 12 ? hours - 12: hours;

        const hoursStr = ( "0" + hours ).slice(-2);
        const minuteStr = ( "0" + day.getMinutes() ).slice(-2);

        timeArr.push( hoursStr + ":" + minuteStr + " " + ampm );
        day.setMinutes( day.getMinutes() + 30);
    }

    return timeArr;
};

export const getCurrentMonthAsString = () => {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date();
    const name = month[date.getMonth()];

    return name;
};

export const getCurrentPosition = async () => {
    const position = await getPosition();
    
    return { lat: (position as any).coords.latitude, lng: (position as any).coords.longitude };
};

export const getCountries = () => {
    const countries = Country.getAllCountries();
    
    return countries;
};

export const getCities = (country: string) => {
    const countryCode = getCode(country);
    const data = City.getCitiesOfCountry(countryCode);
    
    let cities = [];

    data.map((city) => {
        cities.push(city.name);
    });

    return cities;
};

export const getPrice = (price: number, rate: number) => {
    return Math.ceil(price * rate);
  };

export const getPeriodPrice = (price: number, period: number) => {
    const dailyPrice = price / 30;

    return dailyPrice * period
}

export const getQuartelyPrice = (monthlyPrice: number, discount: number = 0) => {
    return monthlyPrice * 3 * (1-  discount/100);
}

export const getHalfYearPrice = (monthlyPrice: number, discount: number = 0) => {
    return monthlyPrice * 6 * (1-  discount/100);
}

export const getYearPrice = (monthlyPrice: number, discount: number = 0) => {
    return monthlyPrice * 12 * (1-  discount/100);
}

export const getTitleFromHit = (hit: Hit) => {
    let selectedTitle = '';

    hit.property.attributes.map((title, index) => {
      if (title) {
        if (index) selectedTitle += ` and ${title.toLowerCase()}`;
        else selectedTitle += title;
      }
    });

    return `${selectedTitle} ${hit.property.beds}-bedroom ${hit.property.propertyType} to ${hit.amountType} in ${hit.property.building.city}`;
}