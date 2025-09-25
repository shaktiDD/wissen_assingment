import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import axios from 'axios';
import moment from 'moment';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const QuarterlyView = ({ country, year, quarter }) => {
    const [quarterData, setQuarterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadQuarterData();
    }, [country, year, quarter]);

    const loadQuarterData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_BASE_URL}/holidays/${country}/${year}/quarter/${quarter}`);
            setQuarterData(response.data);
        } catch (err) {
            setError('Failed to load holiday data');
            console.error('Error loading quarter data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getWeekColorClass = (weekColor) => {
        switch (weekColor) {
            case 'green':
                return 'bg-green-200 border-green-400';
            case 'dark-green':
                return 'bg-green-300 border-green-500';
            default:
                return 'bg-white border-gray-200';
        }
    };

    const isToday = (dateString) => {
        return moment(dateString).isSame(moment(), 'day');
    };

    const formatDate = (dateString) => {
        return moment(dateString).format('MMM D');
    };

    const renderMiniMonth = (monthData) => {
        const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

        return (
            <Card key={monthData.month} className="h-fit">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                            {monthData.monthName}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                            {monthData.totalHolidays}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    {/* Mini calendar header */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map(day => (
                            <div key={day} className="p-1 text-center text-xs font-medium text-muted-foreground">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Mini calendar weeks */}
                    <div className="space-y-1">
                        {monthData.weeks.map(week => (
                            <div key={week.weekNumber} className={`grid grid-cols-7 gap-1 p-1 rounded border ${getWeekColorClass(week.weekColor)}`}>
                                {week.days.map(day => (
                                    <div key={day.date} className={`
                    w-6 h-6 flex items-center justify-center text-xs rounded
                    ${!day.isInMonth ? 'text-gray-300' : 'text-gray-900'}
                    ${isToday(day.date) ? 'bg-blue-500 text-white' : ''}
                    ${day.holidays.length > 0 ? 'bg-red-100 text-red-800' : ''}
                  `}>
                                        {moment(day.date).date()}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Month holidays */}
                    {monthData.holidays.length > 0 && (
                        <div className="mt-4 space-y-1">
                            <div className="text-xs font-medium text-muted-foreground mb-2">Holidays:</div>
                            {monthData.holidays.map((holiday, index) => (
                                <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                                    <div className="font-medium">
                                        {holiday.localName || holiday.name}
                                    </div>
                                    <div className="text-muted-foreground">
                                        {formatDate(holiday.date)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-8">
                    <div className="text-center">
                        <div className="animate-pulse text-muted-foreground">Loading quarter data...</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-8">
                    <div className="text-center text-red-600">{error}</div>
                </CardContent>
            </Card>
        );
    }

    if (!quarterData) {
        return (
            <Card>
                <CardContent className="p-8">
                    <div className="text-center text-muted-foreground">No data available</div>
                </CardContent>
            </Card>
        );
    }

    const totalHolidays = quarterData.months.reduce((sum, month) => sum + month.totalHolidays, 0);

    return (
        <div className="space-y-6">
            {/* Quarter Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">
                            Q{quarterData.quarter} {quarterData.year}
                        </CardTitle>
                        <Badge variant="secondary">
                            {totalHolidays} Holiday{totalHolidays !== 1 ? 's' : ''} Total
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            {/* Three month view */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quarterData.months.map(monthData => renderMiniMonth(monthData))}
            </div>

            {/* Legend */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Legend</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
                        <span className="text-sm">Normal week</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                        <span className="text-sm">1 holiday</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                        <span className="text-sm">2+ holidays</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-100 rounded"></div>
                        <span className="text-sm">Holiday day</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default QuarterlyView;