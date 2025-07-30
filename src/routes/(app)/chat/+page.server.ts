import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	if (!GEMINI_API_KEY) {
		throw error(500, 'Gemini API key not configured');
	}

	try {
		const { prompt } = await request.json();

		if (!prompt || typeof prompt !== 'string') {
			throw error(400, 'Invalid prompt provided');
		}

		// Initialize the Google AI client
		const ai = new GoogleGenAI(GEMINI_API_KEY);

		const response = await ai.models.generateContent({
			model: 'gemini-2.5-flash',
			contents: 'Explain how AI works in a few words'
		});
		console.log(response.text);

		const text = response.text();

		return json({
			success: true,
			response: text
		});
	} catch (err) {
		console.error('Server error:', err);

		if (err instanceof Error && 'status' in err) {
			throw err; // Re-throw SvelteKit errors
		}

		throw error(500, 'Internal server error');
	}
};
