<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { MapPin } from 'lucide-svelte';
	import type { Itinerary } from '$lib/schemas/itinerary';
	import ItineraryOverview from './itinerary-overview.svelte';
	import { testItinerary } from './test-itinerary';

	let itinerary = $state<Itinerary | null>(testItinerary);
</script>

{#if itinerary}
	<ItineraryOverview {itinerary} />
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
			</CardContent>
		</Card>
	</div>
{/if}
