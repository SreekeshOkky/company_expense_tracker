// Analytics event names
export const ANALYTICS_EVENTS = {
  // Auth events
  LOGIN: 'login',
  SIGNUP: 'sign_up',
  LOGOUT: 'logout',
  
  // Expense events
  ADD_EXPENSE: 'add_expense',
  DELETE_EXPENSE: 'delete_expense',
  UPDATE_EXPENSE: 'update_expense',
  
  // Settings events
  UPDATE_SETTINGS: 'update_settings',
  
  // View events
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_ENTRIES: 'view_entries',
  VIEW_SETTINGS: 'view_settings',
  
  // Chart events
  SWITCH_CHART_VIEW: 'switch_chart_view',
  
  // PWA events
  INSTALL_PWA: 'install_pwa'
} as const;