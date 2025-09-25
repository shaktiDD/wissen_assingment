const express = require('express');
const router = express.Router();
const holidayService = require('../services/holidayService');


router.get('/:country/:year/:month', async (req, res) => {
    try {
        const { country, year, month } = req.params;
        if (!country || !year || !month) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const holidays = await holidayService.getHolidaysByMonth(country, parseInt(year), parseInt(month));
        res.json(holidays);
    } catch (error) {
        console.error('Error fetching holidays by month:', error);

        res.status(500).json({ error: 'Failed to fetch holidays' });
    }
});


router.get('/:country/:year/quarter/:quarter', async (req, res) => {

    try {
        const { country, year, quarter } = req.params;

        if (!country || !year || !quarter) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const holidays = await holidayService.getHolidaysByQuarter(country, parseInt(year), parseInt(quarter));
        res.json(holidays);
    } catch (error) {
        console.error('Error fetching holidays by quarter:', error);
        c
        res.status(500).json({ error: 'Failed to fetch holidays' });
    }
});


router.get('/countries', async (req, res) => {
    try {
        const countries = await holidayService.getSupportedCountries();
        res.json(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ error: 'Failed to fetch countries' });
    }
});

module.exports = router;