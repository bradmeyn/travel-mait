import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { OPEN_AI_API_KEY } from '$env/static/private';

// Comprehensive schema for travel itinerary
const activitySchema = z.object({
	time: z.string().describe('Time of day (e.g., "9:00 AM", "2:00 PM")'),
	title: z.string().describe('Name of the activity or attraction'),
	description: z.string().describe('Brief description of what to do/see'),
	duration: z.string().describe('Estimated duration (e.g., "2 hours", "Half day")'),
	cost: z.string().optional().describe('Estimated cost range (e.g., "€15-25", "Free")'),
	tips: z.string().optional().describe('Helpful tips or recommendations')
});

const daySchema = z.object({
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

const itinerarySchema = z.object({
	title: z.string().describe('Catchy title for the itinerary'),
	overview: z.string().describe('Brief overview of the trip'),
	duration: z.number().describe('Total number of days'),
	destinations: z
		.array(
			z.object({
				city: z.string(),
				country: z.string(),
				days_spent: z.number()
			})
		)
		.describe('List of main destinations'),
	trip_style: z.string().describe('Type of trip (relaxing, adventure, cultural, etc.)'),
	best_time_to_visit: z.string().describe('Recommended time of year'),
	daily_itinerary: z.array(daySchema),
	packing_suggestions: z.array(z.string()).optional().describe('What to pack'),
	budget_breakdown: z
		.object({
			accommodation: z.string().describe('Estimated accommodation costs'),
			food: z.string().describe('Estimated food costs'),
			activities: z.string().describe('Estimated activity costs'),
			transportation: z.string().describe('Estimated transportation costs'),
			total_estimate: z.string().describe('Total estimated budget')
		})
		.optional(),
	important_notes: z.array(z.string()).optional().describe('Important travel tips or warnings')
});

export const POST: RequestHandler = async ({ request }) => {
	if (!OPEN_AI_API_KEY) {
		throw error(500, 'OpenAI API key not configured');
	}

	console.log('Received itinerary request');

	try {
		const { prompt } = await request.json();

		if (!prompt || typeof prompt !== 'string') {
			throw error(400, 'Invalid prompt provided');
		}

		const openai = new OpenAI({
			apiKey: OPEN_AI_API_KEY
		});

		// Enhanced system prompt for better itinerary generation
		const systemPrompt = `You are an expert travel planner with extensive knowledge of global destinations. 
		Create detailed, practical itineraries that balance must-see attractions with authentic local experiences.
		
		Consider:
		- Travel logistics and realistic timing
		- Budget-conscious and splurge options
		- Local customs and etiquette
		- Seasonal factors and weather
		- Transportation between locations
		- Mix of popular attractions and hidden gems
		- Dietary restrictions and local cuisine
		- Rest days for longer trips
		
		Make the itinerary engaging, informative, and actionable.`;

		const completion = await openai.responses.parse({
			model: 'gpt-4o-2024-08-06',
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: `Create a detailed travel itinerary for: ${prompt}` }
			],
			response_format: zodResponseFormat(itinerarySchema, 'itinerary'),
			temperature: 0.1,
			max_tokens: 1000
		});

		console.log('Itinerary generation completed successfully', completion);

		const itinerary = completion.output_text;

		if (!itinerary) {
			throw error(500, 'Failed to generate itinerary');
		}

		return json({
			success: true,
			itinerary: itinerary
		});
	} catch (err) {
		console.error('Server error:', err);

		// Handle OpenAI specific errors
		if (err instanceof OpenAI.APIError) {
			console.error('OpenAI API Error:', err.message);
			throw error(500, 'AI service error');
		}

		if (err instanceof Error && 'status' in err) {
			throw err; // Re-throw SvelteKit errors
		}

		throw error(500, 'Internal server error');
	}
};
