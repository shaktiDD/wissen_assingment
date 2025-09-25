import React, { useState, useEffect } from 'react';
import { Calendar, Globe } from 'lucide-react';
import { Button } from './components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import MonthlyView from './components/MonthlyView';
import QuarterlyView from './components/QuarterlyView';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
    const [view, setView] = useState('monthly');
    const [selectedCountry, setSelectedCountry] = useState('IN');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedQuarter, setSelectedQuarter] = useState(Math.ceil((new Date().getMonth() + 1) / 3));
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/holidays/countries`);
            setCountries(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching countries:', error);
            setLoading(false);
        }
    };

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i);
    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];
    const quarters = [
        { value: 1, label: 'Q1' },
        { value: 2, label: 'Q2' },
        { value: 3, label: 'Q3' },
        { value: 4, label: 'Q4' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 animate-pulse mb-4" />
                    <p className="text-gray-600">Loading vacation calendar...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-6 max-w-7xl">
                {/* Header */}
                <Card className="mb-6">
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <Calendar className="h-8 w-8 text-primary" />
                            <CardTitle className="text-3xl font-light">Vacation Calendar</CardTitle>
                        </div>
                        <p className="text-muted-foreground">
                            Track holidays across multiple countries with intelligent week highlighting
                        </p>
                    </CardHeader>
                </Card>

                {/* Controls */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-wrap gap-4 items-center justify-center">
                            {/* View Toggle */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-muted-foreground">View:</label>
                                <div className="flex border rounded-lg overflow-hidden">
                                    <Button
                                        variant={view === 'monthly' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setView('monthly')}
                                        className="rounded-none"
                                    >
                                        Monthly
                                    </Button>
                                    <Button
                                        variant={view === 'quarterly' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setView('quarterly')}
                                        className="rounded-none"
                                    >
                                        Quarterly
                                    </Button>
                                </div>
                            </div>

                            {/* Country Selection */}
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <label className="text-sm font-medium text-muted-foreground">Country:</label>
                                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map(country => (
                                            <SelectItem key={country.code} value={country.code}>
                                                {country.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Year Selection */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-muted-foreground">Year:</label>
                                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map(year => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Month/Quarter Selection */}
                            {view === 'monthly' ? (
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-muted-foreground">Month:</label>
                                    <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map(month => (
                                                <SelectItem key={month.value} value={month.value.toString()}>
                                                    {month.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-muted-foreground">Quarter:</label>
                                    <Select value={selectedQuarter.toString()} onValueChange={(value) => setSelectedQuarter(parseInt(value))}>
                                        <SelectTrigger className="w-[80px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {quarters.map(quarter => (
                                                <SelectItem key={quarter.value} value={quarter.value.toString()}>
                                                    {quarter.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Calendar View */}
                {view === 'monthly' ? (
                    <MonthlyView
                        country={selectedCountry}
                        year={selectedYear}
                        month={selectedMonth}
                    />
                ) : (
                    <QuarterlyView
                        country={selectedCountry}
                        year={selectedYear}
                        quarter={selectedQuarter}
                    />
                )}
            </div>
        </div>
    );
}

export default App;