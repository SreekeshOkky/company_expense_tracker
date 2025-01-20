# Food Expense Tracker
Created by Bolt

A modern, responsive web application for tracking daily food expenses within a team. Built with React, TypeScript, and Firebase.

## Features

### Authentication
- Email and password authentication
- Protected routes for authenticated users
- Secure user session management

### Expense Management
- Add daily food expenses for morning, lunch, and evening meals
- View and edit existing expenses
- Delete unwanted expense entries
- Automatic validation for weekday-only entries

### Dashboard
- Real-time expense tracking
- Daily remaining budget calculation
- Weekly expense overview
- Interactive expense chart showing meal-wise distribution
- Visual indicators for budget status

### Weekly Reports
- Detailed breakdown of daily expenses
- Meal-wise expense categorization
- User-specific expense tracking
- Downloadable expense reports

### Settings
- Configure number of team members
- Set daily expense limits per person
- Automatic budget calculations based on settings

### Mobile-First Design
- Responsive layout for all screen sizes
- Bottom navigation bar for mobile devices
- Touch-friendly interface
- Native-like experience

### Progressive Web App (PWA)
- Installable on desktop and mobile devices
- Offline capability
- Background sync for offline data
- Automatic updates notification

### Data Visualization
- Interactive weekly expense charts
- Visual budget indicators
- Trend analysis for expenses

### Performance
- Optimized bundle size
- Lazy loading of components
- Efficient data caching
- Real-time updates

### Security
- Firebase Authentication
- Secure data access rules
- Protected API endpoints
- User-specific data isolation

## Technical Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Analytics**: Firebase Analytics
- **Charts**: Chart.js with React-Chartjs-2
- **Build Tool**: Vite
- **PWA**: Vite PWA Plugin

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

The following environment variables are required:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## License

MIT License