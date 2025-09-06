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

// ---- Helpers (pure) ----
type YesNo = 'Yes' | 'No' | '';
type Visibility = 'public' | 'private' | '';

const normalizeYesNo = (val?: string): YesNo => (val === 'Yes' ? 'Yes' : val === 'No' ? 'No' : '');

const normalizeVisibility = (val?: string): Visibility =>
  val === 'public' || val === 'private' ? (val as Visibility) : '';

export interface AccessibilityPayload {
  visibility: 'public' | 'private';
  wheelchairAccessible: boolean | null;
  parkingAvailable: boolean | null;
  attendeesCoverFees: boolean;
  minAge: number | null;
}

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

  // Accessibility helpers
  ensureAccessibilityDefaults: () => void;
  buildAccessibilityPayload: () => AccessibilityPayload;
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
        set({ errors: newErrors });
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

        // Event Setup
        form['Event Setup'] = {
          name: eventData?.name || '',
          description: eventData?.description || '',
          coverImage: eventData?.bannerImage || '',
          category: eventData?.category || '',
          // tags: store first tag id if array, else value
          tags:
            eventData?.tags && Array.isArray(eventData.tags) && eventData.tags.length > 0
              ? eventData.tags[0].id || eventData.tags[0]
              : eventData?.tags || '',
          selectedTags:
            eventData?.tags && Array.isArray(eventData.tags) && eventData.tags.length > 0
              ? eventData.tags[0].id || eventData.tags[0]
              : eventData?.tags || '',
          contactNumber: eventData?.contactPhone || number || '',
          seriesId: eventData?.seriesId || '',
          seriesName: eventData?.series?.name || '',
        };

        // Schedule & Location
        form['Schedule & Location'] = {
          eventType: eventData?.eventType || '',
          startDate: eventData?.startDate ? eventData.startDate.slice(0, 10) : '',
          endDate: eventData?.endDate ? eventData.endDate.slice(0, 10) : '',
          startTime: eventData?.startTime || '',
          endTime: eventData?.endTime || '',
          venueName: eventData?.venueName || eventData?.location || '',
          selectedLocation:
            eventData?.selectedLocation ||
            (eventData?.venueName
              ? {
                  name: eventData.venueName,
                  lat: eventData?.coordinates?.lat || 0,
                  lon: eventData?.coordinates?.lon || 0,
                }
              : null),
          address: eventData?.address || null,
          coordinates: eventData?.coordinates || null,
          showLocation: !!(
            eventData?.venueName ||
            eventData?.location ||
            eventData?.selectedLocation
          ),
          isLocationTBA: !(
            eventData?.venueName ||
            eventData?.location ||
            eventData?.selectedLocation
          ),
        };

        // Accessibility (default to 'public' if missing/unknown)
        form['Accessibility'] = {
          eventVisibility: normalizeVisibility(eventData?.visibility) || 'public',
          wheelchairAccess:
            eventData?.wheelchairAccessible === true
              ? 'Yes'
              : eventData?.wheelchairAccessible === false
                ? 'No'
                : '',
          parkingAvailable:
            eventData?.parkingAvailable === true
              ? 'Yes'
              : eventData?.parkingAvailable === false
                ? 'No'
                : '',
          transferCharges: !!eventData?.attendeesCoverFees,
          minAge: eventData?.minAge != null ? String(eventData.minAge) : '',
        };

        // Tickets Create
        if (eventData?.tickets && eventData.tickets.length > 0) {
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

      // ---- Accessibility helpers ----
      ensureAccessibilityDefaults: () => {
        const { form } = get();
        const current = (form['Accessibility'] ?? {}) as Record<string, any>;

        const next = {
          eventVisibility: normalizeVisibility(current.eventVisibility) || 'public',
          wheelchairAccess: normalizeYesNo(current.wheelchairAccess) || '',
          parkingAvailable: normalizeYesNo(current.parkingAvailable) || '',
          transferCharges:
            typeof current.transferCharges === 'boolean' ? current.transferCharges : false,
          minAge: typeof current.minAge === 'string' ? current.minAge : '',
        };

        set((state) => ({ form: { ...state.form, Accessibility: next } }));
      },

      buildAccessibilityPayload: (): AccessibilityPayload => {
        const { form } = get();
        const acc = (form['Accessibility'] ?? {}) as Record<string, any>;

        const visibility = (normalizeVisibility(acc.eventVisibility) || 'public') as
          | 'public'
          | 'private';

        const wheelchairAccessible =
          acc.wheelchairAccess === 'Yes' ? true : acc.wheelchairAccess === 'No' ? false : null;

        const parkingAvailable =
          acc.parkingAvailable === 'Yes' ? true : acc.parkingAvailable === 'No' ? false : null;

        const attendeesCoverFees = !!acc.transferCharges;

        const minAge = acc.minAge && String(acc.minAge).trim() !== '' ? Number(acc.minAge) : null;

        return {
          visibility,
          wheelchairAccessible,
          parkingAvailable,
          attendeesCoverFees,
          minAge,
        };
      },
    }),
    { name: 'event-creation-storage' },
  ),
);
