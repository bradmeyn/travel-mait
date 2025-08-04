import { z } from 'zod';

// Activity schema
export const activitySchema = z.object({
	time: z.string().describe('Time of day (e.g., "9:00 AM", "2:00 PM")'),
	title: z.string().describe('Name of the activity or attraction'),
	description: z.string().describe('Brief description of what to do/see'),
	duration: z.string().describe('Estimated duration (e.g., "2 hours", "Half day")'),
	cost: z.string().optional().describe('Estimated cost range (e.g., "€15-25", "Free")'),
	tips: z.string().optional().describe('Helpful tips or recommendations')
});

// Day itinerary schema
export const dayItinerarySchema = z.object({
	day: z.number().describe('Day number of the trip'),
	date: z.string().optional().describe('Suggested date (if specific dates provided)'),
	location: z.string().describe('Primary city/location for this day'),
	theme: z.string().describe('Overall theme or focus of the day'),
	activities: z.array(activitySchema).describe('List of activities for the day'),
	meals: z
		.object({
			breakfast: z.string().optional().describe('Breakfast recommendation'),
			lunch: z.string().optional().describe('Lunch recommendation'),
			dinner: z.string().optional().describe('Dinner recommendation')
		})
		.optional(),
	accommodation: z.string().optional().describe('Where to stay (if changing locations)'),
	transportation: z.string().optional().describe('How to get around or to next destination'),
	budget_estimate: z.string().optional().describe('Estimated daily budget')
});

// Destination schema
export const destinationSchema = z.object({
	city: z.string(),
	country: z.string(),
	days_spent: z.number()
});

// Budget breakdown schema
export const budgetBreakdownSchema = z.object({
	accommodation: z.string().describe('Estimated accommodation costs'),
	food: z.string().describe('Estimated food costs'),
	activities: z.string().describe('Estimated activity costs'),
	transportation: z.string().describe('Estimated transportation costs'),
	total_estimate: z.string().describe('Total estimated budget')
});

// Main itinerary schema
export const itinerarySchema = z.object({
	id: z.string().describe('Unique identifier for the itinerary'),
	title: z.string().describe('Catchy title for the itinerary'),
	overview: z.string().describe('Brief overview of the trip'),
	duration: z.number().describe('Total number of days'),
	destinations: z.array(destinationSchema).describe('List of main destinations'),
	trip_style: z.string().describe('Type of trip (relaxing, adventure, cultural, etc.)'),
	best_time_to_visit: z.string().describe('Recommended time of year'),
	daily_itinerary: z.array(dayItinerarySchema),
	packing_suggestions: z.array(z.string()).optional().describe('What to pack'),
	budget_breakdown: budgetBreakdownSchema.optional(),
	important_notes: z.array(z.string()).optional().describe('Important travel tips or warnings'),
	created_at: z.date().describe('When the itinerary was created'),
	updated_at: z.date().optional().describe('When the itinerary was last updated')
});

// Export TypeScript types
export type Activity = z.infer<typeof activitySchema>;
export type DayItinerary = z.infer<typeof dayItinerarySchema>;
export type Destination = z.infer<typeof destinationSchema>;
export type BudgetBreakdown = z.infer<typeof budgetBreakdownSchema>;
export type Itinerary = z.infer<typeof itinerarySchema>;

// Validation helpers
export function validateItinerary(data: unknown): Itinerary {
	return itinerarySchema.parse(data);
}

export function validateActivity(data: unknown): Activity {
	return activitySchema.parse(data);
}

export function validateDayItinerary(data: unknown): DayItinerary {
	return dayItinerarySchema.parse(data);
}
