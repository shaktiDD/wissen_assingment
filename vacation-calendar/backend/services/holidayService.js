const axios = require('axios');
const moment = require('moment');

class HolidayService {
    constructor() {
        this.calendarificURL = 'https://calendarific.com/api/v2/holidays';
        this.calendarificKey = process.env.CALENDARIFIC_API_KEY || 'your_calendarific_api_key_here';
        this.abstractURL = 'https://holidays.abstractapi.com/v1';
        this.abstractKey = process.env.ABSTRACT_API_KEY || 'your_api_key_here';
        this.fallbackURL = 'https://date.nager.at/api/v3';
        
        this.predefinedHolidays = {
            'IN': { 
                2024: [
                    { date: '2024-01-01', name: 'New Year\'s Day', localName: 'New Year\'s Day', global: true, type: 'National holiday' },
                    { date: '2024-01-14', name: 'Makar Sankranti (Harvest Festival)', localName: 'Makar Sankranti', global: true, type: 'Hindu festival' },
                    { date: '2024-01-15', name: 'Pongal (Tamil Harvest Festival)', localName: 'Pongal', global: false, type: 'Regional festival' },
                    { date: '2024-01-26', name: 'Republic Day', localName: 'Republic Day', global: true, type: 'National holiday' },
                    { date: '2024-02-14', name: 'Vasant Panchami (Spring Festival)', localName: 'Vasant Panchami', global: true, type: 'Hindu festival' },
                    { date: '2024-02-24', name: 'Maha Shivratri (Great Night of Shiva)', localName: 'Maha Shivratri', global: true, type: 'Hindu festival' },
                    { date: '2024-03-08', name: 'Holi (Festival of Colors)', localName: 'Holi', global: true, type: 'Hindu festival' },
                    { date: '2024-03-25', name: 'Good Friday', localName: 'Good Friday', global: true, type: 'Christian holiday' },
                    { date: '2024-04-09', name: 'Ugadi (Telugu New Year)', localName: 'Ugadi', global: false, type: 'Regional festival' },
                    { date: '2024-04-11', name: 'Eid ul-Fitr (Festival of Breaking the Fast)', localName: 'Eid ul-Fitr', global: true, type: 'Islamic holiday' },
                    { date: '2024-04-14', name: 'Baisakhi (Punjabi New Year)', localName: 'Baisakhi', global: false, type: 'Regional festival' },
                    { date: '2024-04-17', name: 'Ram Navami (Lord Rama\'s Birthday)', localName: 'Ram Navami', global: true, type: 'Hindu festival' },
                    { date: '2024-04-21', name: 'Hanuman Jayanti (Lord Hanuman\'s Birthday)', localName: 'Hanuman Jayanti', global: true, type: 'Hindu festival' },
                    { date: '2024-05-23', name: 'Buddha Purnima (Buddha\'s Birthday)', localName: 'Buddha Purnima', global: true, type: 'Buddhist holiday' },
                    { date: '2024-06-17', name: 'Eid ul-Adha (Festival of Sacrifice)', localName: 'Eid ul-Adha', global: true, type: 'Islamic holiday' },
                    { date: '2024-07-07', name: 'Guru Purnima (Teacher\'s Day)', localName: 'Guru Purnima', global: true, type: 'Hindu festival' },
                    { date: '2024-08-15', name: 'Independence Day', localName: 'Independence Day', global: true, type: 'National holiday' },
                    { date: '2024-08-19', name: 'Raksha Bandhan (Brother-Sister Bond)', localName: 'Raksha Bandhan', global: true, type: 'Hindu festival' },
                    { date: '2024-08-26', name: 'Krishna Janmashtami (Lord Krishna\'s Birthday)', localName: 'Krishna Janmashtami', global: true, type: 'Hindu festival' },
                    { date: '2024-09-07', name: 'Ganesh Chaturthi (Lord Ganesha Festival)', localName: 'Ganesh Chaturthi', global: true, type: 'Hindu festival' },
                    { date: '2024-10-02', name: 'Gandhi Jayanti (Mahatma Gandhi\'s Birthday)', localName: 'Gandhi Jayanti', global: true, type: 'National holiday' },
                    { date: '2024-10-12', name: 'Dussehra (Victory of Good over Evil)', localName: 'Dussehra', global: true, type: 'Hindu festival' },
                    { date: '2024-10-31', name: 'Dhanteras (Wealth Festival)', localName: 'Dhanteras', global: true, type: 'Hindu festival' },
                    { date: '2024-11-01', name: 'Diwali (Festival of Lights)', localName: 'Diwali', global: true, type: 'Hindu festival' },
                    { date: '2024-11-02', name: 'Govardhan Puja (Mountain Lifting Festival)', localName: 'Govardhan Puja', global: true, type: 'Hindu festival' },
                    { date: '2024-11-03', name: 'Bhai Dooj (Brother-Sister Love)', localName: 'Bhai Dooj', global: true, type: 'Hindu festival' },
                    { date: '2024-11-15', name: 'Guru Nanak Jayanti (Guru Nanak\'s Birthday)', localName: 'Guru Nanak Jayanti', global: true, type: 'Sikh holiday' },
                    { date: '2024-12-25', name: 'Christmas Day', localName: 'Christmas Day', global: true, type: 'Christian holiday' }
                ],
                2025: [
                    { date: '2025-01-01', name: 'New Year\'s Day', localName: 'New Year\'s Day', global: true, type: 'National holiday' },
                    { date: '2025-01-14', name: 'Makar Sankranti (Harvest Festival)', localName: 'Makar Sankranti', global: true, type: 'Hindu festival' },
                    { date: '2025-01-15', name: 'Pongal (Tamil Harvest Festival)', localName: 'Pongal', global: false, type: 'Regional festival' },
                    { date: '2025-01-26', name: 'Republic Day', localName: 'Republic Day', global: true, type: 'National holiday' },
                    { date: '2025-02-03', name: 'Vasant Panchami (Spring Festival)', localName: 'Vasant Panchami', global: true, type: 'Hindu festival' },
                    { date: '2025-02-26', name: 'Maha Shivratri (Great Night of Shiva)', localName: 'Maha Shivratri', global: true, type: 'Hindu festival' },
                    { date: '2025-03-14', name: 'Holi (Festival of Colors)', localName: 'Holi', global: true, type: 'Hindu festival' },
                    { date: '2025-03-30', name: 'Ram Navami (Lord Rama\'s Birthday)', localName: 'Ram Navami', global: true, type: 'Hindu festival' },
                    { date: '2025-04-13', name: 'Baisakhi (Punjabi New Year)', localName: 'Baisakhi', global: false, type: 'Regional festival' },
                    { date: '2025-04-18', name: 'Good Friday', localName: 'Good Friday', global: true, type: 'Christian holiday' },
                    { date: '2025-05-12', name: 'Buddha Purnima (Buddha\'s Birthday)', localName: 'Buddha Purnima', global: true, type: 'Buddhist holiday' },
                    { date: '2025-06-06', name: 'Eid ul-Adha (Festival of Sacrifice)', localName: 'Eid ul-Adha', global: true, type: 'Islamic holiday' },
                    { date: '2025-08-09', name: 'Raksha Bandhan (Brother-Sister Bond)', localName: 'Raksha Bandhan', global: true, type: 'Hindu festival' },
                    { date: '2025-08-15', name: 'Independence Day', localName: 'Independence Day', global: true, type: 'National holiday' },
                    { date: '2025-08-16', name: 'Krishna Janmashtami (Lord Krishna\'s Birthday)', localName: 'Krishna Janmashtami', global: true, type: 'Hindu festival' },
                    { date: '2025-08-27', name: 'Ganesh Chaturthi (Lord Ganesha Festival)', localName: 'Ganesh Chaturthi', global: true, type: 'Hindu festival' },
                    { date: '2025-10-02', name: 'Gandhi Jayanti (Mahatma Gandhi\'s Birthday)', localName: 'Gandhi Jayanti', global: true, type: 'National holiday' },
                    { date: '2025-10-02', name: 'Dussehra (Victory of Good over Evil)', localName: 'Dussehra', global: true, type: 'Hindu festival' },
                    { date: '2025-10-20', name: 'Dhanteras (Wealth Festival)', localName: 'Dhanteras', global: true, type: 'Hindu festival' },
                    { date: '2025-10-21', name: 'Diwali (Festival of Lights)', localName: 'Diwali', global: true, type: 'Hindu festival' },
                    { date: '2025-10-22', name: 'Govardhan Puja (Mountain Lifting Festival)', localName: 'Govardhan Puja', global: true, type: 'Hindu festival' },
                    { date: '2025-10-23', name: 'Bhai Dooj (Brother-Sister Love)', localName: 'Bhai Dooj', global: true, type: 'Hindu festival' },
                    { date: '2025-11-05', name: 'Guru Nanak Jayanti (Guru Nanak\'s Birthday)', localName: 'Guru Nanak Jayanti', global: true, type: 'Sikh holiday' },
                    { date: '2025-12-25', name: 'Christmas Day', localName: 'Christmas Day', global: true, type: 'Christian holiday' }
                ]
            },
            'US': { 
                2024: [
                    { date: '2024-01-01', name: 'New Year\'s Day', localName: 'New Year\'s Day', global: true, type: 'National holiday' },
                    { date: '2024-07-04', name: 'Independence Day', localName: 'Independence Day', global: true, type: 'National holiday' },
                    { date: '2024-12-25', name: 'Christmas Day', localName: 'Christmas Day', global: true, type: 'National holiday' }
                ],
                2025: [
                    { date: '2025-01-01', name: 'New Year\'s Day', localName: 'New Year\'s Day', global: true, type: 'National holiday' },
                    { date: '2025-07-04', name: 'Independence Day', localName: 'Independence Day', global: true, type: 'National holiday' },
                    { date: '2025-12-25', name: 'Christmas Day', localName: 'Christmas Day', global: true, type: 'National holiday' }
                ]
            }
        };
    }

    async getHolidaysByMonth(countryCode, year, month) {
        try {
            let allHolidays = [];

            if (this.predefinedHolidays[countryCode] && this.predefinedHolidays[countryCode][year]) {
                allHolidays = this.predefinedHolidays[countryCode][year];
            } else {
                if (this.calendarificKey && this.calendarificKey !== 'your_calendarific_api_key_here') {
                    try {
                        const response = await axios.get(this.calendarificURL, {
                            params: {
                                api_key: this.calendarificKey,
                                country: countryCode,
                                year: year
                            }
                        });

                        if (response.data && response.data.response && response.data.response.holidays) {
                            allHolidays = response.data.response.holidays.map(holiday => ({
                                date: holiday.date.iso,
                                name: holiday.name,
                                localName: holiday.description || holiday.name,
                                global: holiday.primary_type !== 'Local holiday',
                                type: holiday.primary_type || 'Holiday'
                            }));
                        }
                    } catch (calendarificError) {
                        if (this.abstractKey && this.abstractKey !== 'your_api_key_here') {
                            try {
                                const response = await axios.get(`${this.abstractURL}`, {
                                    params: {
                                        api_key: this.abstractKey,
                                        country: countryCode,
                                        year: year
                                    }
                                });

                                if (response.data && Array.isArray(response.data)) {
                                    allHolidays = response.data.map(holiday => ({
                                        date: holiday.date,
                                        name: holiday.name,
                                        localName: holiday.name_local || holiday.name,
                                        global: holiday.type === 'National',
                                        type: holiday.type || 'National holiday'
                                    }));
                                }
                            } catch (abstractError) {
                                throw abstractError;
                            }
                        } else {
                            throw calendarificError;
                        }
                    }
                } else {
                    if (this.abstractKey && this.abstractKey !== 'your_api_key_here') {
                        try {
                            const response = await axios.get(`${this.abstractURL}`, {
                                params: {
                                    api_key: this.abstractKey,
                                    country: countryCode,
                                    year: year
                                }
                            });

                            if (response.data && Array.isArray(response.data)) {
                                allHolidays = response.data.map(holiday => ({
                                    date: holiday.date,
                                    name: holiday.name,
                                    localName: holiday.name_local || holiday.name,
                                    global: holiday.type === 'National',
                                    type: holiday.type || 'National holiday'
                                }));
                            }
                        } catch (abstractError) {
                            throw abstractError;
                        }
                    } else {
                        try {
                            const response = await axios.get(`${this.fallbackURL}/publicholidays/${year}/${countryCode}`);
                            allHolidays = response.data.map(holiday => ({
                                date: holiday.date,
                                name: holiday.name,
                                localName: holiday.localName || holiday.name,
                                global: holiday.global || true,
                                type: holiday.types ? holiday.types.join(', ') : 'Holiday'
                            }));
                        } catch (fallbackError) {
                            allHolidays = [];
                        }
                    }
                }
            }

            const monthHolidays = allHolidays.filter(holiday => {
                const holidayDate = moment(holiday.date);
                return holidayDate.month() + 1 === month;
            });

            return this.calculateWeekData(monthHolidays, year, month);
        } catch (error) {
            console.error('All holiday APIs failed:', error.message);
            return this.calculateWeekData([], year, month);
        }
    }

    async getHolidaysByQuarter(countryCode, year, quarter) {
        try {
            let allHolidays = [];

            if (this.predefinedHolidays[countryCode] && this.predefinedHolidays[countryCode][year]) {
                allHolidays = this.predefinedHolidays[countryCode][year];
            } else {
                if (this.calendarificKey && this.calendarificKey !== 'your_calendarific_api_key_here') {
                    try {
                        const response = await axios.get(this.calendarificURL, {
                            params: {
                                api_key: this.calendarificKey,
                                country: countryCode,
                                year: year
                            }
                        });

                        if (response.data && response.data.response && response.data.response.holidays) {
                            allHolidays = response.data.response.holidays.map(holiday => ({
                                date: holiday.date.iso,
                                name: holiday.name,
                                localName: holiday.description || holiday.name,
                                global: holiday.primary_type !== 'Local holiday',
                                type: holiday.primary_type || 'Holiday'
                            }));
                        }
                    } catch (calendarificError) {
                        if (this.abstractKey && this.abstractKey !== 'your_api_key_here') {
                            try {
                                const response = await axios.get(`${this.abstractURL}`, {
                                    params: {
                                        api_key: this.abstractKey,
                                        country: countryCode,
                                        year: year
                                    }
                                });

                                if (response.data && Array.isArray(response.data)) {
                                    allHolidays = response.data.map(holiday => ({
                                        date: holiday.date,
                                        name: holiday.name,
                                        localName: holiday.name_local || holiday.name,
                                        global: holiday.type === 'National',
                                        type: holiday.type || 'National holiday'
                                    }));
                                }
                            } catch (abstractError) {
                                throw abstractError;
                            }
                        } else {
                            throw calendarificError;
                        }
                    }
                } else {
                    if (this.abstractKey && this.abstractKey !== 'your_api_key_here') {
                        try {
                            const response = await axios.get(`${this.abstractURL}`, {
                                params: {
                                    api_key: this.abstractKey,
                                    country: countryCode,
                                    year: year
                                }
                            });

                            if (response.data && Array.isArray(response.data)) {
                                allHolidays = response.data.map(holiday => ({
                                    date: holiday.date,
                                    name: holiday.name,
                                    localName: holiday.name_local || holiday.name,
                                    global: holiday.type === 'National',
                                    type: holiday.type || 'National holiday'
                                }));
                            }
                        } catch (abstractError) {
                            throw abstractError;
                        }
                    } else {
                        try {
                            const response = await axios.get(`${this.fallbackURL}/publicholidays/${year}/${countryCode}`);
                            allHolidays = response.data.map(holiday => ({
                                date: holiday.date,
                                name: holiday.name,
                                localName: holiday.localName || holiday.name,
                                global: holiday.global || true,
                                type: holiday.types ? holiday.types.join(', ') : 'Holiday'
                            }));
                        } catch (fallbackError) {
                            allHolidays = [];
                        }
                    }
                }
            }

            const quarterMonths = this.getQuarterMonths(quarter);
            const quarterHolidays = allHolidays.filter(holiday => {
                const holidayDate = moment(holiday.date);
                return quarterMonths.includes(holidayDate.month() + 1);
            });

            const monthsData = [];
            for (const month of quarterMonths) {
                const monthHolidays = quarterHolidays.filter(holiday => {
                    const holidayDate = moment(holiday.date);
                    return holidayDate.month() + 1 === month;
                });

                monthsData.push(this.calculateWeekData(monthHolidays, year, month));
            }

            return {
                quarter,
                year,
                months: monthsData
            };
        } catch (error) {
            console.error('All holiday APIs failed for quarter:', error.message);
            const quarterMonths = this.getQuarterMonths(quarter);
            const monthsData = [];
            for (const month of quarterMonths) {
                monthsData.push(this.calculateWeekData([], year, month));
            }

            return {
                quarter,
                year,
                months: monthsData
            };
        }
    }

    async getSupportedCountries() {
        try {
            const extendedCountries = [
                { code: 'IN', name: 'India' },
                { code: 'US', name: 'United States' },
                { code: 'GB', name: 'United Kingdom' },
                { code: 'CA', name: 'Canada' },
                { code: 'AU', name: 'Australia' },
                { code: 'DE', name: 'Germany' },
                { code: 'FR', name: 'France' },
                { code: 'JP', name: 'Japan' },
                { code: 'CN', name: 'China' },
                { code: 'BR', name: 'Brazil' },
                { code: 'IT', name: 'Italy' },
                { code: 'ES', name: 'Spain' },
                { code: 'RU', name: 'Russia' },
                { code: 'MX', name: 'Mexico' },
                { code: 'KR', name: 'South Korea' },
                { code: 'SG', name: 'Singapore' },
                { code: 'MY', name: 'Malaysia' },
                { code: 'TH', name: 'Thailand' },
                { code: 'ID', name: 'Indonesia' },
                { code: 'PH', name: 'Philippines' },
                { code: 'VN', name: 'Vietnam' },
                { code: 'BD', name: 'Bangladesh' },
                { code: 'PK', name: 'Pakistan' },
                { code: 'LK', name: 'Sri Lanka' },
                { code: 'NP', name: 'Nepal' },
                { code: 'AE', name: 'United Arab Emirates' },
                { code: 'SA', name: 'Saudi Arabia' }
            ];

            try {
                const response = await axios.get(`${this.fallbackURL}/availablecountries`);
                const dateNagerCountries = response.data.map(country => ({
                    code: country.countryCode,
                    name: country.name
                }));

                const allCountries = [...extendedCountries];
                dateNagerCountries.forEach(country => {
                    if (!allCountries.find(c => c.code === country.code)) {
                        allCountries.push(country);
                    }
                });

                return allCountries.sort((a, b) => a.name.localeCompare(b.name));
            } catch (error) {
                return extendedCountries.sort((a, b) => a.name.localeCompare(b.name));
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
            throw new Error('Failed to fetch countries');
        }
    }

    calculateWeekData(holidays, year, month) {
        const startDate = moment([year, month - 1, 1]);
        const endDate = moment(startDate).endOf('month');

        const weeks = [];
        const current = moment(startDate).startOf('isoWeek');

        while (current.isSameOrBefore(endDate, 'week')) {
            const week = {
                weekNumber: current.isoWeek(),
                startDate: current.format('YYYY-MM-DD'),
                endDate: moment(current).endOf('isoWeek').format('YYYY-MM-DD'),
                holidays: [],
                days: []
            };

            for (let i = 0; i < 7; i++) {
                const day = moment(current).add(i, 'days');
                const dayHolidays = holidays.filter(holiday =>
                    moment(holiday.date).isSame(day, 'day')
                );

                week.days.push({
                    date: day.format('YYYY-MM-DD'),
                    dayOfWeek: day.format('dddd'),
                    isInMonth: day.month() + 1 === month,
                    holidays: dayHolidays
                });

                week.holidays.push(...dayHolidays);
            }

            week.holidays = week.holidays.filter((holiday, index, self) =>
                index === self.findIndex(h => h.date === holiday.date)
            );

            week.holidayCount = week.holidays.length;
            week.weekColor = this.getWeekColor(week.holidayCount);

            weeks.push(week);
            current.add(1, 'week');
        }

        return {
            year,
            month,
            monthName: moment([year, month - 1]).format('MMMM'),
            totalHolidays: holidays.length,
            holidays,
            weeks
        };
    }

    getQuarterMonths(quarter) {
        const quarters = {
            1: [1, 2, 3],
            2: [4, 5, 6],
            3: [7, 8, 9],
            4: [10, 11, 12]
        };
        return quarters[quarter] || [];
    }

    getWeekColor(holidayCount) {
        if (holidayCount === 0) return 'normal';
        if (holidayCount === 1) return 'green';
        return 'dark-green';
    }
}

module.exports = new HolidayService();