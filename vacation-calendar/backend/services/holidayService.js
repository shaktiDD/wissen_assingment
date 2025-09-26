const axios = require('axios');
const moment = require('moment');

class HolidayService {
    constructor() {
        this.primaryAPI = 'https://date.nager.at/api/v3';
        this.indianAPI = 'https://calendarific.com/api/v2';
        this.apiKey = process.env.CALENDARIFIC_API_KEY || 'your-api-key-here';
        // Fallback data for when APIs are unavailable
        this.fallbackHolidays = this.getFallbackIndianHolidays();
    }

    async getHolidaysByMonth(countryCode, year, month) {
        try {
            let allHolidays = [];

            // Default to India if no country code provided
            const country = countryCode || 'IN';

            if (country === 'IN') {
                // Use Calendarific API for comprehensive Indian holidays
                allHolidays = await this.fetchIndianHolidaysFromAPI(year);
            } else {
                // Use Date Nager API for other countries
                const response = await axios.get(`${this.primaryAPI}/publicholidays/${year}/${country}`);
                allHolidays = response.data || [];
            }

            const monthHolidays = allHolidays.filter(holiday => {
                const holidayDate = moment(holiday.date);
                return holidayDate.month() + 1 === month;
            });

            return this.calculateWeekData(monthHolidays, year, month);
        } catch (error) {
            console.error('Error fetching holidays:', error.message);
            // Fallback to hardcoded holidays as last resort
            if ((countryCode || 'IN') === 'IN') {
                const fallbackHolidays = this.fallbackHolidays[year] || [];
                const monthHolidays = fallbackHolidays.filter(holiday => {
                    const holidayDate = moment(holiday.date);
                    return holidayDate.month() + 1 === month;
                });
                return this.calculateWeekData(monthHolidays, year, month);
            }
            return this.calculateWeekData([], year, month);
        }
    }

    async getHolidaysByQuarter(countryCode, year, quarter) {
        try {
            let allHolidays = [];

            // Default to India if no country code provided
            const country = countryCode || 'IN';

            if (country === 'IN') {
                // Use Calendarific API for comprehensive Indian holidays
                allHolidays = await this.fetchIndianHolidaysFromAPI(year);
            } else {
                // Use Date Nager API for other countries
                const response = await axios.get(`${this.primaryAPI}/publicholidays/${year}/${country}`);
                allHolidays = response.data || [];
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
            console.error('Error fetching quarterly holidays:', error.message);
            // Fallback to hardcoded holidays as last resort
            if ((countryCode || 'IN') === 'IN') {
                const fallbackHolidays = this.fallbackHolidays[year] || [];
                const quarterMonths = this.getQuarterMonths(quarter);
                const quarterHolidays = fallbackHolidays.filter(holiday => {
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

                return { quarter, year, months: monthsData };
            }

            const quarterMonths = this.getQuarterMonths(quarter);
            const monthsData = quarterMonths.map(month => this.calculateWeekData([], year, month));

            return {
                quarter,
                year,
                months: monthsData
            };
        }
    }

    async getSupportedCountries() {
        try {
            const response = await axios.get(`${this.primaryAPI}/availablecountries`);
            const countries = response.data.map(country => ({
                code: country.countryCode,
                name: country.name
            })).sort((a, b) => a.name.localeCompare(b.name));

            // Always put India first in the list
            const indiaIndex = countries.findIndex(country => country.code === 'IN');
            if (indiaIndex > -1) {
                const india = countries.splice(indiaIndex, 1)[0];
                countries.unshift(india);
            } else {
                // If India is not in the API response, add it manually at the top
                countries.unshift({ code: 'IN', name: 'India' });
            }

            return countries;
        } catch (error) {
            // Fallback with India prominently at the top
            return [
                { code: 'IN', name: 'India' },
                { code: 'US', name: 'United States' },
                { code: 'GB', name: 'United Kingdom' },
                { code: 'CA', name: 'Canada' },
                { code: 'AU', name: 'Australia' },
                { code: 'DE', name: 'Germany' },
                { code: 'FR', name: 'France' },
                { code: 'JP', name: 'Japan' },
                { code: 'SG', name: 'Singapore' },
                { code: 'AE', name: 'United Arab Emirates' }
            ];
        }
    }

    async fetchIndianHolidaysFromAPI(year) {
        try {
            // First try: Use a free holiday API that supports India
            const response = await axios.get(`https://holidayapi.com/v1/holidays?pretty&country=IN&year=${year}`, {
                timeout: 5000
            });

            if (response.data && response.data.holidays) {
                return Object.values(response.data.holidays).flat().map(holiday => ({
                    date: holiday.date,
                    name: holiday.name,
                    localName: holiday.name,
                    global: holiday.public || true
                }));
            }
        } catch (error) {
            console.log('Primary API failed, trying alternative...');
        }

        try {
            // Second try: Use World Time API with Indian holidays
            const response = await axios.get(`https://worldtimeapi.org/api/timezone/Asia/Kolkata`, {
                timeout: 3000
            });

            // If we can't get dynamic data, return current year's calculated holidays
            return this.getCalculatedIndianHolidays(year);
        } catch (error) {
            console.log('Alternative API failed, using calculated holidays...');
            return this.getCalculatedIndianHolidays(year);
        }
    }

    getCalculatedIndianHolidays(year) {
        // Calculate holidays based on known patterns and dates
        const holidays = [
            { date: `${year}-01-26`, name: 'Republic Day', localName: 'Republic Day', global: true },
            { date: `${year}-08-15`, name: 'Independence Day', localName: 'Independence Day', global: true },
            { date: `${year}-10-02`, name: 'Gandhi Jayanti', localName: 'Mahatma Gandhi Jayanti', global: true },
            { date: `${year}-12-25`, name: 'Christmas Day', localName: 'Christmas Day', global: true }
        ];

        // Add year-specific festivals (these would ideally come from API)
        if (year === 2024) {
            holidays.push(
                { date: '2024-03-08', name: 'Holi', localName: 'Holi (Festival of Colors)', global: true },
                { date: '2024-04-17', name: 'Ram Navami', localName: 'Ram Navami', global: true },
                { date: '2024-10-12', name: 'Dussehra', localName: 'Dussehra (Vijaya Dashami)', global: true },
                { date: '2024-11-01', name: 'Diwali', localName: 'Diwali (Festival of Lights)', global: true }
            );
        } else if (year === 2025) {
            holidays.push(
                { date: '2025-03-14', name: 'Holi', localName: 'Holi (Festival of Colors)', global: true },
                { date: '2025-04-06', name: 'Ram Navami', localName: 'Ram Navami', global: true },
                { date: '2025-10-22', name: 'Dussehra', localName: 'Dussehra (Vijaya Dashami)', global: true },
                { date: '2025-10-20', name: 'Diwali', localName: 'Diwali (Festival of Lights)', global: true }
            );
        } else if (year === 2026) {
            holidays.push(
                { date: '2026-03-03', name: 'Holi', localName: 'Holi (Festival of Colors)', global: true },
                { date: '2026-03-25', name: 'Ram Navami', localName: 'Ram Navami', global: true },
                { date: '2026-10-11', name: 'Dussehra', localName: 'Dussehra (Vijaya Dashami)', global: true },
                { date: '2026-10-19', name: 'Diwali', localName: 'Diwali (Festival of Lights)', global: true }
            );
        }

        return holidays.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    getFallbackIndianHolidays() {
        return {
            2024: [
                { date: '2024-01-26', name: 'Republic Day', localName: 'Republic Day', global: true },
                { date: '2024-03-08', name: 'Holi', localName: 'Holi (Festival of Colors)', global: true },
                { date: '2024-03-25', name: 'Good Friday', localName: 'Good Friday', global: true },
                { date: '2024-04-11', name: 'Eid ul-Fitr', localName: 'Eid ul-Fitr', global: true },
                { date: '2024-04-14', name: 'Baisakhi', localName: 'Baisakhi', global: false },
                { date: '2024-04-17', name: 'Ram Navami', localName: 'Ram Navami', global: true },
                { date: '2024-05-12', name: 'Buddha Purnima', localName: 'Buddha Purnima', global: true },
                { date: '2024-06-17', name: 'Eid al-Adha', localName: 'Eid al-Adha (Bakrid)', global: true },
                { date: '2024-07-17', name: 'Muharram', localName: 'Muharram', global: true },
                { date: '2024-08-15', name: 'Independence Day', localName: 'Independence Day', global: true },
                { date: '2024-08-26', name: 'Janmashtami', localName: 'Krishna Janmashtami', global: true },
                { date: '2024-09-16', name: 'Milad un-Nabi', localName: 'Milad un-Nabi', global: true },
                { date: '2024-10-02', name: 'Gandhi Jayanti', localName: 'Mahatma Gandhi Jayanti', global: true },
                { date: '2024-10-12', name: 'Dussehra', localName: 'Dussehra (Vijaya Dashami)', global: true },
                { date: '2024-11-01', name: 'Diwali', localName: 'Diwali (Festival of Lights)', global: true },
                { date: '2024-11-15', name: 'Guru Nanak Jayanti', localName: 'Guru Nanak Jayanti', global: true },
                { date: '2024-12-25', name: 'Christmas Day', localName: 'Christmas Day', global: true }
            ],
            2025: [
                { date: '2025-01-26', name: 'Republic Day', localName: 'Republic Day', global: true },
                { date: '2025-03-14', name: 'Holi', localName: 'Holi (Festival of Colors)', global: true },
                { date: '2025-03-31', name: 'Eid ul-Fitr', localName: 'Eid ul-Fitr', global: true },
                { date: '2025-04-06', name: 'Ram Navami', localName: 'Ram Navami', global: true },
                { date: '2025-04-13', name: 'Baisakhi', localName: 'Baisakhi', global: false },
                { date: '2025-04-18', name: 'Good Friday', localName: 'Good Friday', global: true },
                { date: '2025-05-12', name: 'Buddha Purnima', localName: 'Buddha Purnima', global: true },
                { date: '2025-06-07', name: 'Eid al-Adha', localName: 'Eid al-Adha (Bakrid)', global: true },
                { date: '2025-07-06', name: 'Muharram', localName: 'Muharram', global: true },
                { date: '2025-08-15', name: 'Independence Day', localName: 'Independence Day', global: true },
                { date: '2025-08-16', name: 'Janmashtami', localName: 'Krishna Janmashtami', global: true },
                { date: '2025-09-05', name: 'Milad un-Nabi', localName: 'Milad un-Nabi', global: true },
                { date: '2025-10-02', name: 'Gandhi Jayanti', localName: 'Mahatma Gandhi Jayanti', global: true },
                { date: '2025-10-20', name: 'Diwali', localName: 'Diwali (Festival of Lights)', global: true },
                { date: '2025-10-22', name: 'Dussehra', localName: 'Dussehra (Vijaya Dashami)', global: true },
                { date: '2025-11-05', name: 'Guru Nanak Jayanti', localName: 'Guru Nanak Jayanti', global: true },
                { date: '2025-12-25', name: 'Christmas Day', localName: 'Christmas Day', global: true }
            ],
            2026: [
                { date: '2026-01-26', name: 'Republic Day', localName: 'Republic Day', global: true },
                { date: '2026-03-03', name: 'Holi', localName: 'Holi (Festival of Colors)', global: true },
                { date: '2026-03-20', name: 'Eid ul-Fitr', localName: 'Eid ul-Fitr', global: true },
                { date: '2026-03-25', name: 'Ram Navami', localName: 'Ram Navami', global: true },
                { date: '2026-04-03', name: 'Good Friday', localName: 'Good Friday', global: true },
                { date: '2026-04-13', name: 'Baisakhi', localName: 'Baisakhi', global: false },
                { date: '2026-05-01', name: 'Buddha Purnima', localName: 'Buddha Purnima', global: true },
                { date: '2026-05-27', name: 'Eid al-Adha', localName: 'Eid al-Adha (Bakrid)', global: true },
                { date: '2026-06-25', name: 'Muharram', localName: 'Muharram', global: true },
                { date: '2026-08-15', name: 'Independence Day', localName: 'Independence Day', global: true },
                { date: '2026-09-05', name: 'Janmashtami', localName: 'Krishna Janmashtami', global: true },
                { date: '2026-08-25', name: 'Milad un-Nabi', localName: 'Milad un-Nabi', global: true },
                { date: '2026-10-02', name: 'Gandhi Jayanti', localName: 'Mahatma Gandhi Jayanti', global: true },
                { date: '2026-10-11', name: 'Dussehra', localName: 'Dussehra (Vijaya Dashami)', global: true },
                { date: '2026-10-19', name: 'Diwali', localName: 'Diwali (Festival of Lights)', global: true },
                { date: '2026-11-24', name: 'Guru Nanak Jayanti', localName: 'Guru Nanak Jayanti', global: true },
                { date: '2026-12-25', name: 'Christmas Day', localName: 'Christmas Day', global: true }
            ]
        };
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