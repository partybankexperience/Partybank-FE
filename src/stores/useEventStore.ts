import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const stages = [
  'Event Setup',
  'Schedule & Location',
  'Tickets Create',
  'Accessibility',
  'Notifications',
  // 'Event Guests',
  'Review & Publish',
]

interface EventData {
  stage: string
  form: Record<string, Record<string, any>>
  setStage: (stage: string) => void
  setForm: (form: Record<string, any>) => void
  setFormValue: (stage: string, key: string, value: any) => void
}

export const useEventStore = create<EventData>()(
  persist(
    (set, get) => ({
      stage: 'Event Setup',
      form: {},
      setStage: (stage) => set(() => ({ stage })),
      setForm: (form) => set(() => ({ form })),
      setFormValue: (stage, key, value) => {
        const prevForm = get().form
        set({
          form: {
            ...prevForm,
            [stage]: {
              ...prevForm[stage],
              [key]: value,
            },
          },
        })
      },
    }),
    {
      name: 'event-creation-storage',
    }
  )
)
