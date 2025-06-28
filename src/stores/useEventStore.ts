import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Storage } from './InAppStorage';

export const stages = [
  'Event Setup',
  'Schedule & Location',
  'Tickets Create',
  'Accessibility',
  'Notifications',
  // 'Event Guests',
  'Review & Publish',
];
const number = Storage.getItem('user')?.phoneNumber;
interface EventData {
  stage: string;
  form: Record<string, Record<string, any>>;
  errors: Record<string, Record<string, string>>;
  isNextButtonDisabled: boolean;
  setStage: (stage: string) => void;
  setForm: (form: Record<string, any>) => void;
  setFormValue: (stage: string, key: string, value: any) => void;
  setError: (stage: string, key: string, error: string) => void;
  clearError: (stage: string, key: string) => void;
  clearStageErrors: (stage: string) => void;
  setIsNextButtonDisabled: (disabled: boolean) => void;
  // Actions
  clearForm: (stage: string) => void;
  resetEventStore: () => void;
  clearEventStorage: () => void;
  conditionalClearStorage: () => void;
  prefillEventData: (eventData: any) => void;
  mapBackendStepToFrontend: (backendStep: string) => string;
}

export const useEventStore = create<EventData>()(
  persist(
    (set, get) => ({
      stage: 'Event Setup',
      form: {},
      errors: {},
      isNextButtonDisabled: false,
      setStage: (stage) => set(() => ({ stage })),
      setForm: (form) => set(() => ({ form })),
      setFormValue: (stage, key, value) => {
        const prevForm = get().form;
        set({
          form: {
            ...prevForm,
            [stage]: {
              ...prevForm[stage],
              [key]: value,
            },
          },
        });
      },
      setError: (stage, key, error) => {
        const prevErrors = get().errors;
        set({
          errors: {
            ...prevErrors,
            [stage]: {
              ...prevErrors[stage],
              [key]: error,
            },
          },
        });
      },
      clearError: (stage, key) => {
        const prevErrors = get().errors;
        const stageErrors = { ...prevErrors[stage] };
        delete stageErrors[key];
        set({
          errors: {
            ...prevErrors,
            [stage]: stageErrors,
          },
        });
      },
      clearStageErrors: (stage) => {
        const prevErrors = get().errors;
        const newErrors = { ...prevErrors };
        delete newErrors[stage];
        set({
          errors: newErrors,
        });
      },
      clearForm: (stage) => {
        const prevForm = get().form;
        const newForm = { ...prevForm };
        delete newForm[stage];
        set({ form: newForm });
      },
      resetEventStore: () => {
        set(() => ({
          form: {},
          errors: {},
          stage: 'Event Setup',
          isNextButtonDisabled: false,
        }));
        localStorage.removeItem('event-creation-storage');
      },
      setIsNextButtonDisabled: (disabled) => set({ isNextButtonDisabled: disabled }),
      clearEventStorage: () => {
        localStorage.removeItem('event-creation-storage');
        set(() => ({
          form: {},
          errors: {},
          stage: 'Event Setup',
          isNextButtonDisabled: false,
        }));
      },
      conditionalClearStorage: () => {
        // Only clear if there's no eventId in storage (new event creation)
        const eventId = localStorage.getItem('eventId');
        if (!eventId) {
          localStorage.removeItem('event-creation-storage');
          set(() => ({
            form: {},
            errors: {},
            stage: 'Event Setup',
            isNextButtonDisabled: false,
          }));
        }
      },

      prefillEventData: (eventData: any) => {
        const form: Record<string, any> = {};

        // Map backend data to Event Setup stage
        form['Event Setup'] = {
          name: eventData.name || '',
          description: eventData.description || '',
          coverImage: eventData.bannerImage || '',
          category: eventData.category || '',
          // Handle tags - if it's an array, get the first tag's ID, otherwise use the value
          tags:
            eventData.tags && Array.isArray(eventData.tags) && eventData.tags.length > 0
              ? eventData.tags[0].id || eventData.tags[0]
              : eventData.tags || '',
          selectedTags:
            eventData.tags && Array.isArray(eventData.tags) && eventData.tags.length > 0
              ? eventData.tags[0].id || eventData.tags[0]
              : eventData.tags || '',
          contactNumber: eventData.contactPhone || number || '',
          seriesId: eventData.seriesId || '',
          // Add series name for display if available
          seriesName: eventData.series?.name || '',
        };

        // Map backend data to Schedule & Location stage
        form['Schedule & Location'] = {
          eventType: eventData.eventType || '',
          startDate: eventData.startDate || '',
          endDate: eventData.endDate || '',
          startTime: eventData.startTime || '',
          endTime: eventData.endTime || '',
          venueName: eventData.venueName || eventData.location || '',
          selectedLocation:
            eventData.selectedLocation ||
            (eventData.venueName
              ? {
                  name: eventData.venueName,
                  lat: eventData.coordinates?.lat || 0,
                  lon: eventData.coordinates?.lon || 0,
                }
              : null),
          address: eventData.address || null,
          coordinates: eventData.coordinates || null,
          showLocation: !!(eventData.venueName || eventData.location || eventData.selectedLocation),
          isLocationTBA: !(eventData.venueName || eventData.location || eventData.selectedLocation),
        };

        // Map backend data to Accessibility stage
        form['Accessibility'] = {
          eventVisibility: eventData.visibility || '',
          wheelchairAccess: eventData.wheelchairAccessible ? 'Yes' : 'No',
          parkingAvailable: eventData.parkingAvailable ? 'Yes' : 'No',
          transferCharges: eventData.attendeesCoverFees || false,
          minAge: eventData.minAge?.toString() || '',
        };

        // Map tickets if any
        if (eventData.tickets && eventData.tickets.length > 0) {
          // console.log(eventData.tickets,'the tickets from the event side');
          form['Tickets Create'] = {
            tickets: eventData.tickets.map((ticket: any) => ({
              ...ticket,
              isSaved: true,
            })),
          };
        }

        set(() => ({ form }));
      },
      mapBackendStepToFrontend: (backendStep: string): string => {
        const stepMapping: Record<string, string> = {
          eventSetup: 'Event Setup',
          scheduleLocation: 'Schedule & Location',
          ticketSetup: 'Tickets Create',
          accessibility: 'Accessibility',
          notifications: 'Notifications',
          reviewPublish: 'Review & Publish',
        };
        return stepMapping[backendStep] || 'Event Setup';
      },
    }),
    {
      name: 'event-creation-storage',
    },
  ),
);
