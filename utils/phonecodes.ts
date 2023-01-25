import { Country }  from 'country-state-city';

const countries = Country.getAllCountries();

let phonecodes = [];

countries.map((country) => {
	const item = { code: country.isoCode, name: country.name, dial_code: `+${country.phonecode}` };
	phonecodes.push(item);
});

export const getIndexOfCountry = (country: string) => {
	let index = 0;
  
	phonecodes.map((phonecode, i) => {
		if (phonecode.name === country) index = i;
	});
  
	return index;
}

export default phonecodes;