<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { MapPin } from 'lucide-svelte';
	import type { Itinerary } from '$lib/schemas/itinerary';
	import ItineraryOverview from './itinerary-overview.svelte';

	// Standalone itinerary state - can be set from parent or managed internally
	let itinerary = $state<Itinerary | null>(null);

	// Props for external control (optional)
	interface Props {
		initialItinerary?: Itinerary | null;
		onItineraryChange?: (itinerary: Itinerary | null) => void;
	}

	let { initialItinerary = null, onItineraryChange }: Props = $props();

	// Initialize with prop if provided
	$effect(() => {
		if (initialItinerary !== undefined) {
			itinerary = initialItinerary;
		}
	});

	// Notify parent of changes
	$effect(() => {
		if (onItineraryChange) {
			onItineraryChange(itinerary);
		}
	});

	function handleClose() {
		itinerary = null;
	}

	function setItinerary(newItinerary: Itinerary | null) {
		itinerary = newItinerary;
	}

	// Expose methods for external use
	export { setItinerary };

	// Placeholder data for development
	const placeholderItinerary: Itinerary = {
		id: 'placeholder-123',
		title: 'Amazing European Adventure',
		overview:
			"A wonderful journey through Europe's most beautiful destinations, featuring historic cities, stunning coastlines, and authentic cultural experiences.",
		duration: 10,
		destinations: [
			{ city: 'Paris', country: 'France', days_spent: 3 },
			{ city: 'Rome', country: 'Italy', days_spent: 3 },
			{ city: 'Barcelona', country: 'Spain', days_spent: 4 }
		],
		trip_style: 'Cultural & Relaxing',
		best_time_to_visit: 'May-September',
		daily_itinerary: [
			{
				day: 1,
				location: 'Paris',
				theme: 'Arrival & First Impressions',
				activities: [
					{
						time: '10:00 AM',
						title: 'Airport Transfer',
						description: 'Arrive at Charles de Gaulle Airport and transfer to hotel',
						duration: '2 hours',
						cost: '€25'
					},
					{
						time: '2:00 PM',
						title: 'Eiffel Tower Visit',
						description: 'Visit the iconic Eiffel Tower and enjoy panoramic views of Paris',
						duration: '3 hours',
						cost: '€15-25',
						tips: 'Book tickets online to skip the lines'
					},
					{
						time: '6:00 PM',
						title: 'Seine River Cruise',
						description: 'Relaxing evening cruise along the Seine with dinner',
						duration: '2 hours',
						cost: '€45-65'
					}
				],
				meals: {
					lunch: 'Café de Flore - Classic Parisian bistro',
					dinner: 'Included in Seine cruise'
				},
				accommodation: 'Hotel Malte Opera - Central Paris location',
				budget_estimate: '€150-200'
			},
			{
				day: 2,
				location: 'Paris',
				theme: 'Art & Culture',
				activities: [
					{
						time: '9:00 AM',
						title: 'Louvre Museum',
						description: "Explore the world's largest art museum, home to the Mona Lisa",
						duration: '4 hours',
						cost: '€17',
						tips: 'Pre-book tickets and consider a guided tour'
					},
					{
						time: '2:00 PM',
						title: 'Latin Quarter Walk',
						description: 'Stroll through historic streets and visit Notre-Dame area',
						duration: '2 hours',
						cost: 'Free'
					}
				],
				meals: {
					breakfast: 'Hotel breakfast',
					lunch: "L'As du Fallafel - Famous falafel in Le Marais",
					dinner: 'Le Comptoir du Relais - Traditional French cuisine'
				},
				budget_estimate: '€120-160'
			}
		],
		packing_suggestions: [
			'Comfortable walking shoes',
			'Light rain jacket',
			'Portable phone charger',
			'Travel adapter (EU plug)',
			'Camera for sightseeing'
		],
		budget_breakdown: {
			accommodation: '€800-1,200 (10 nights)',
			food: '€400-600 (€40-60 per day)',
			activities: '€200-350 (museums, tours)',
			transportation: '€150-250 (flights, trains, local transport)',
			total_estimate: '€1,550-2,400 per person'
		},
		important_notes: [
			'Carry a copy of your passport at all times',
			'Many museums are closed on Mondays',
			'Tipping 10% is customary in restaurants',
			'Book popular attractions in advance during peak season'
		],
		created_at: new Date(),
		updated_at: new Date()
	};

	// Development helper - load placeholder data
	function loadPlaceholder() {
		itinerary = placeholderItinerary;
	}
</script>

{#if itinerary}
	<ItineraryOverview {itinerary} onClose={handleClose} />
{:else}
	<!-- Empty State -->
	<div class="flex h-full items-center justify-center">
		<Card class="mx-auto max-w-md border-zinc-700 bg-zinc-800">
			<CardContent class="p-8 text-center">
				<div class="mb-4 text-gray-400">
					<MapPin class="mx-auto mb-4 h-16 w-16 opacity-50" />
				</div>
				<h3 class="mb-2 text-lg font-semibold text-gray-300">No Itinerary Loaded</h3>
				<p class="mb-4 text-gray-500">
					Create a new itinerary or load an existing one to get started
				</p>

				<!-- Development helper button -->
				<button
					class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-500"
					onclick={loadPlaceholder}
				>
					Load Sample Itinerary
				</button>
			</CardContent>
		</Card>
	</div>
{/if}
