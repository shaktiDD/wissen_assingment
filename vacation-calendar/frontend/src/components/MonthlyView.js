import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import axios from 'axios';
import moment from 'moment';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const MonthlyView = ({ country, year, month }) => {
    const [monthData, setMonthData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadMonthData();
    }, [country, year, month]);

    const loadMonthData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_BASE_URL}/holidays/${country}/${year}/${month}`);
            setMonthData(response.data);
        } catch (err) {
            setError('Failed to load holiday data');
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

    const renderWeekHeader = () => {
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return (
            <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderWeek = (week) => {
        return (
            <div key={week.weekNumber} className={`grid grid-cols-7 gap-1 mb-1 p-2 rounded-lg border ${getWeekColorClass(week.weekColor)}`}>
                {week.days.map(day => (
                    <div key={day.date} className={`
            min-h-[80px] p-2 rounded border
            ${!day.isInMonth ? 'text-gray-300 bg-gray-50' : 'bg-white'}
            ${isToday(day.date) ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
            hover:shadow-sm transition-shadow
          `}>
                        <div className="text-sm font-medium mb-1">
                            {moment(day.date).date()}
                        </div>
                        {day.holidays.length > 0 && (
                            <div className="space-y-1">
                                {day.holidays.map((holiday, index) => (
                                    <div
                                        key={index}
                                        className="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded truncate"
                                        title={holiday.localName || holiday.name}
                                    >
                                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                                        {(holiday.localName || holiday.name).substring(0, 12)}
                                        {(holiday.localName || holiday.name).length > 12 && '...'}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-8">
                    <div className="text-center">
                        <div className="animate-pulse text-muted-foreground">Loading calendar data...</div>
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

    if (!monthData) {
        return (
            <Card>
                <CardContent className="p-8">
                    <div className="text-center text-muted-foreground">No data available</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">
                            {monthData.monthName} {monthData.year}
                        </CardTitle>
                        <Badge variant="secondary">
                            {monthData.totalHolidays} Holiday{monthData.totalHolidays !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="calendar">
                        {renderWeekHeader()}
                        {monthData.weeks.map(week => renderWeek(week))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Legend</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
                            <span className="text-sm">Normal week (no holidays)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                            <span className="text-sm">Week with 1 holiday</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                            <span className="text-sm">Week with 2+ holidays</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                            <span className="text-sm">Holiday indicator</span>
                        </div>
                    </CardContent>
                </Card>

                {monthData.holidays.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Holidays in {monthData.monthName}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {monthData.holidays.map((holiday, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-medium text-sm">
                                                {holiday.localName || holiday.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {formatDate(holiday.date)}
                                            </div>
                                        </div>
                                        {holiday.global && (
                                            <Badge variant="outline" className="text-xs">
                                                National
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default MonthlyView;