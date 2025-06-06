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
  errors: Record<string, Record<string, string>>
  setStage: (stage: string) => void
  setForm: (form: Record<string, any>) => void
  setFormValue: (stage: string, key: string, value: any) => void
  setError: (stage: string, key: string, error: string) => void
  clearError: (stage: string, key: string) => void
  clearStageErrors: (stage: string) => void
}

export const useEventStore = create<EventData>()(
  persist(
    (set, get) => ({
      stage: 'Event Setup',
      form: {},
      errors: {},
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
      setError: (stage, key, error) => {
        const prevErrors = get().errors
        set({
          errors: {
            ...prevErrors,
            [stage]: {
              ...prevErrors[stage],
              [key]: error,
            },
          },
        })
      },
      clearError: (stage, key) => {
        const prevErrors = get().errors
        const stageErrors = { ...prevErrors[stage] }
        delete stageErrors[key]
        set({
          errors: {
            ...prevErrors,
            [stage]: stageErrors,
          },
        })
      },
      clearStageErrors: (stage) => {
        const prevErrors = get().errors
        const newErrors = { ...prevErrors }
        delete newErrors[stage]
        set({
          errors: newErrors,
        })
      },
    }),
    {
      name: 'event-creation-storage',
    }
  )
)
