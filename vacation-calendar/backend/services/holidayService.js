const axios = require('axios');
const moment = require('moment');

class HolidayService {
    constructor() {
        this.apiURL = 'https://date.nager.at/api/v3';
    }

    async getHolidaysByMonth(countryCode, year, month) {
        try {
            const response = await axios.get(`${this.apiURL}/publicholidays/${year}/${countryCode}`);
            const allHolidays = response.data || [];

            const monthHolidays = allHolidays.filter(holiday => {
                const holidayDate = moment(holiday.date);
                return holidayDate.month() + 1 === month;
            });

            return this.calculateWeekData(monthHolidays, year, month);
        } catch (error) {
            return this.calculateWeekData([], year, month);
        }
    }

    async getHolidaysByQuarter(countryCode, year, quarter) {
        try {
            const response = await axios.get(`${this.apiURL}/publicholidays/${year}/${countryCode}`);
            const allHolidays = response.data || [];

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
            const response = await axios.get(`${this.apiURL}/availablecountries`);
            return response.data.map(country => ({
                code: country.countryCode,
                name: country.name
            })).sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            return [
                { code: 'IN', name: 'India' },
                { code: 'US', name: 'United States' },
                { code: 'GB', name: 'United Kingdom' },
                { code: 'CA', name: 'Canada' },
                { code: 'AU', name: 'Australia' },
                { code: 'DE', name: 'Germany' },
                { code: 'FR', name: 'France' }
            ];
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