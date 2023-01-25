const en = require('./translations.en.json');
const ar = require('./translations.ar.json');
const ge = require('./translations.ge.json');
const hi = require('./translations.hi.json');
const cn = require('./translations.cn.json');
const ru = require('./translations.ru.json');

const i18n = {
	translations: {
		en: en.i18n,
		ar: ar.i18n,
    	ge: ge.i18n,
		hi: hi.i18n,
		cn: cn.i18n,
		ru: ru.i18n,
	},
	defaultLang: 'en'
}

module.exports = i18n;
