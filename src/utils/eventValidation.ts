
// Event stage validation rules and logic
export const validationRules = {
  'Event Setup': {
    name: { required: true, message: 'Event name is required' },
    description: { required: true, message: 'Event description is required' },
    coverImage: { required: true, message: 'Cover image is required' },
    tags: { required: true, message: 'Please select or create a tag' },
    category: { required: true, message: 'Event category is required' },
    contactNumber: { required: true, message: 'Contact number is required' },
  },
  'Schedule & Location': {
    eventType: { required: true, message: 'Event type is required' },
    startDate: { required: true, message: 'Start date is required' },
    startTime: { required: true, message: 'Start time is required' },
    endTime: { required: true, message: 'End time is required' },
    endDate: { 
      required: (formData: any) => formData.eventType === 'Multiple Day', 
      message: 'End date is required for multiple day events' 
    },
    venueName: { 
      required: (formData: any) => formData.showLocation !== false, 
      message: 'Venue name is required when location is provided' 
    },
  },
  'Tickets Create': {
    // At least one ticket should be created
    tickets: { required: true, message: 'At least one ticket is required' },
  },
  'Accessibility': {
    // These might be optional but we can add rules if needed
  },
  'Notifications': {
    // These might be optional but we can add rules if needed
  },
  'Review & Publish': {
    // Final validation before publishing
  },
}

export const validateStage = (stage: string, formData: Record<string, any>) => {
  const rules = validationRules[stage as keyof typeof validationRules]
  if (!rules) return { isValid: true, errors: {} }

  const errors: Record<string, string> = {}
  let isValid = true

  Object.entries(rules).forEach(([field, rule]) => {
    const value = formData[field]
    
    // Handle conditional required fields
    const isRequired = typeof rule.required === 'function' 
      ? rule.required(formData) 
      : rule.required;
    
    if (isRequired) {
      if (!value || value === '' || (Array.isArray(value) && value.length === 0)) {
        errors[field] = rule.message
        isValid = false
      }
    }
  })

  return { isValid, errors }
}

export const getRequiredFields = (stage: string): string[] => {
  const rules = validationRules[stage as keyof typeof validationRules]
  if (!rules) return []
  
  return Object.entries(rules)
    .filter(([_, rule]) => rule.required)
    .map(([field, _]) => field)
}
