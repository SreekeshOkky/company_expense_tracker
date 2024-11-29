Created using bolt.new

*Prompt Set 1:*
Use firebase and react
Create an app to enter daily food expense for a team (Morning, Lunch and Dinner) in rupee.
Entry should be only for weekdays.
Settings to setup no of person and limit for each person per day
Dashboard to see daily total expense and weekly aggregated expense. Available balance for the day and week.
Option to download monthly report as json

*Response:*
* Firebase Integration: Set up Firebase for data storage and management.

* Component Structure:
  * ExpenseForm: Add daily expenses for morning, lunch, and dinner
  * Settings: Configure team size and per-person daily limits
  * Dashboard: View daily and weekly expenses with remaining balance

* Key Features:
  * Weekday-only expense entry
  * Real-time expense tracking
  * Weekly budget calculations
  * Monthly report download as JSON
  * Responsive design with Tailwind CSS
  * Lucide React icons for better UI

* Data Organization:
  * Separate types for better type safety
  * Modular component structure
  * Clean and maintainable code

* To use the application:
  * Replace the Firebase configuration in src/lib/firebase.ts with your own Firebase credentials
  * Configure team settings in the Settings page
  * Start adding daily expenses
  * Monitor expenses and budgets in the Dashboard
The application is now running on the development server. You can navigate between different sections using the navigation bar at the top.

*Prompt Set 2:*
add login and signup using firebase
make the app pwa with offline sync

*Response:*

* Authentication:
  * Login and Signup forms
  * Protected routes
  * Authentication context
  * User session management

* PWA Support:
  * Service worker setup
  * Offline caching
  * App manifest
  * Icons for installation

* Offline Sync:
    * IndexedDB for local storage
    * Background sync for expenses
    * Offline-first architecture

* Code Organization:
  *  Separate contexts for auth
  *  Utility functions for database operations
  *  Type definitions
  *  Component-based architecture

* To use the application:
  * Replace the Firebase configuration in src/lib/firebase.ts
  * Add PWA icons in the public folder

* Users can now:
  * Sign up/login
  * Add expenses offline
  * Data will sync when online
  * Install as PWA
The application will now work offline and sync data when the connection is restored. Users need to authenticate before accessing the expense tracking features.
