<script lang="ts">
	import { getChatState } from '../chat-state.svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { MapPin } from 'lucide-svelte';
	import ItineraryOverview from './itinerary-overview.svelte';

	const chat = getChatState();

	function handleClose() {
		chat.setCurrentItinerary(null);
	}
</script>

{#if chat.currentItinerary}
	<ItineraryOverview itinerary={chat.currentItinerary} onClose={handleClose} />
{:else}
	<!-- Empty State -->
	<div class="flex h-full items-center justify-center">
		<Card class="mx-auto max-w-md border-zinc-700 bg-zinc-800">
			<CardContent class="p-8 text-center">
				<div class="mb-4 text-gray-400">
					<MapPin class="mx-auto mb-4 h-16 w-16 opacity-50" />
				</div>
				<h3 class="mb-2 text-lg font-semibold text-gray-300">No Itinerary Selected</h3>
				<p class="text-gray-500">Select an itinerary from the chat to view detailed information</p>
			</CardContent>
		</Card>
	</div>
{/if}
