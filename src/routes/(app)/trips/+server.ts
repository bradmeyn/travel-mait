import { json } from '@sveltejs/kit';

export async function GET() {
	// Simulate multiple trips for testing
	const trips = [
		{
			id: 1,
			name: 'Beach Getaway',
			destination: 'Bali',
			startDate: '2023-06-15',
			endDate: '2023-06-30'
		}
	];
	return json({ trips });
}
