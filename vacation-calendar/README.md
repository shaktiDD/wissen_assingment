# Vacation Calendar - Full Stack Application

A clean, minimalistic vacation calendar application that displays holidays for multiple countries with intelligent week highlighting.

## ✨ Features

- **Multi-Country Support**: Select from 150+ countries to view their national holidays
- **Dynamic Views**: Switch between monthly and quarterly calendar views
- **Smart Week Highlighting**:
  - Green background: Weeks with 1 holiday
  - Dark green background: Weeks with 2+ holidays
  - Individual holidays highlighted with red indicators
- **No Hardcoded Days**: All dates are dynamically calculated
- **Clean UI**: Built with Shadcn UI and Tailwind CSS for a modern, minimalistic design
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

### Backend

- **Node.js** with Express.js
- **Moment.js** for date handling
- **Axios** for API requests
- **Date Nager API** for holiday data

### Frontend

- **React 18** for the user interface
- **Shadcn UI** components for consistent design
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Moment.js** for date formatting

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   cd vacation-calendar
   ```

2. **Set up the Backend**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

3. **Set up the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## 📱 Usage

1. **Select Country**: Choose from the dropdown of available countries
2. **Choose View**: Toggle between Monthly and Quarterly views
3. **Navigate Time**: Select year, month, or quarter using the controls
4. **View Holidays**:
   - Weeks are colored based on holiday count
   - Individual holidays are marked with red indicators
   - Hover over holidays for full names

## 🎨 Design Philosophy

- **Minimalistic**: Clean interface without clutter
- **Intuitive**: Easy-to-understand color coding and layout
- **Accessible**: High contrast colors and clear typography
- **Responsive**: Works on all device sizes

## 🌍 Supported Countries

The application now supports **India with comprehensive festival coverage** and 100+ other countries:

### **🇮🇳 Complete Indian Festival Coverage (24+ Holidays):**

**National Holidays:**

- New Year's Day (Jan 1)
- Republic Day (Jan 26)
- Independence Day (Aug 15)
- Gandhi Jayanti (Oct 2)

**Major Hindu Festivals:**

- Makar Sankranti, Vasant Panchami, Maha Shivratri, Holi, Ram Navami
- Hanuman Jayanti, Raksha Bandhan, Krishna Janmashtami, Ganesh Chaturthi
- Dussehra, Dhanteras, Diwali, Govardhan Puja, Bhai Dooj

**Other Religious & Regional:**

- Pongal (Regional), Baisakhi (Sikh), Buddha Purnima (Buddhist)
- Christmas (Christian), Eid ul-Fitr & Eid ul-Adha (Islamic)
- Guru Nanak Jayanti (Sikh), Ugadi (Regional)

### **Other Supported Countries:**

- **🇺🇸 United States (US)** - **🇬🇧 United Kingdom (GB)** - **🇨🇦 Canada (CA)**
- **🇦🇺 Australia (AU)** - **🇩🇪 Germany (DE)** - **🇫🇷 France (FR)**
- **🇯🇵 Japan (JP)** - **🇨🇳 China (CN)** - **🇧🇷 Brazil (BR)**
- And 100+ more countries with API support

### **Multi-Tier API System:**

1. **🥇 Calendarific API** - Primary (comprehensive festival data)
2. **🥈 Abstract API** - Secondary fallback
3. **🥉 Date Nager API** - Basic fallback
4. **📚 Offline Database** - Predefined comprehensive data

### **India Holiday Examples (2025) - 24 Total Festivals:**

**🏛️ National:** Republic Day (Jan 26), Independence Day (Aug 15), Gandhi Jayanti (Oct 2)  
**🕉️ Hindu:** Holi (Mar 14), Diwali (Oct 21), Dussehra (Oct 2), Raksha Bandhan (Aug 9)  
**🌺 Regional:** Pongal (Jan 15), Makar Sankranti (Jan 14), Baisakhi (Apr 13)  
**🎯 Multi-Faith:** Christmas (Dec 25), Eid ul-Adha (Jun 6), Guru Nanak Jayanti (Nov 5)

## 📊 Week Highlighting Logic

- **Normal Week**: White background - no holidays
- **Light Green**: 1 holiday in the week
- **Dark Green**: 2 or more holidays in the week
- **Red Indicators**: Individual holiday markers on specific dates

## 🔧 API Endpoints

### Backend Routes

- `GET /api/holidays/:country/:year/:month` - Get holidays for a specific month
- `GET /api/holidays/:country/:year/quarter/:quarter` - Get holidays for a quarter
- `GET /api/holidays/countries` - Get list of supported countries
- `GET /api/health` - Health check endpoint

### Example Response

```json
{
  "year": 2024,
  "month": 12,
  "monthName": "December",
  "totalHolidays": 1,
  "holidays": [
    {
      "date": "2024-12-25",
      "localName": "Christmas Day",
      "name": "Christmas Day",
      "global": true
    }
  ],
  "weeks": [...]
}
```

## 🚀 Deployment

### Backend Deployment

1. Set environment variables:
   ```env
   PORT=5000
   NODE_ENV=production
   ```
2. Build and deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment

1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to your hosting service
3. Set `REACT_APP_API_URL` to your backend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m 'Add some feature'`
5. Push: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Date Nager API](https://date.nager.at/) for providing holiday data
- [Shadcn UI](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
