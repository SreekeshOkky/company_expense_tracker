import { useCallback } from 'react';
import { logAnalyticsEvent } from '../lib/firebase';
import { ANALYTICS_EVENTS } from '../lib/analytics/events';

export const useAnalytics = () => {
  const trackEvent = useCallback((
    eventName: keyof typeof ANALYTICS_EVENTS,
    eventParams?: Record<string, any>
  ) => {
    logAnalyticsEvent(ANALYTICS_EVENTS[eventName], eventParams);
  }, []);

  return { trackEvent };
};