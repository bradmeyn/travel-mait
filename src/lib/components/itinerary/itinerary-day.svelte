<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import type { DayItinerary } from '../chat-state.svelte';
	import ItineraryActivity from './itinerary-activity.svelte';

	interface Props {
		day: DayItinerary;
		value: string;
	}

	let { day, value }: Props = $props();
</script>

<Accordion.Item {value} class="border border-zinc-700 rounded-lg">
	<Accordion.Trigger class="w-full p-4 text-left hover:bg-zinc-700/50 transition-colors rounded-lg">
		<div class="flex items-center justify-between w-full">
			<div>
				<h4 class="font-semibold text-white">Day {day.day}: {day.location}</h4>
				<p class="text-sm text-gray-400">{day.theme}</p>
			</div>
		</div>
	</Accordion.Trigger>
	
	<Accordion.Content class="border-t border-zinc-700 bg-zinc-800/50">
		<div class="p-4 space-y-4">
			<!-- Activities -->
			<div>
				<h5 class="mb-3 font-medium text-gray-200 flex items-center gap-2">
					🎯 Activities
				</h5>
				<div class="space-y-3">
					{#each day.activities as activity}
						<ItineraryActivity {activity} />
					{/each}
				</div>
			</div>

			<!-- Meals -->
			{#if day.meals}
				<div>
					<h5 class="mb-3 font-medium text-gray-200 flex items-center gap-2">
						🍽️ Meals
					</h5>
					<Card class="bg-zinc-900 border-zinc-700">
						<CardContent class="p-3 space-y-2">
							{#if day.meals.breakfast}
								<div class="text-sm flex items-start gap-2">
									<span class="text-orange-400 font-medium">🥞 Breakfast:</span>
									<span class="text-gray-300">{day.meals.breakfast}</span>
								</div>
							{/if}
							{#if day.meals.lunch}
								<div class="text-sm flex items-start gap-2">
									<span class="text-yellow-400 font-medium">🥗 Lunch:</span>
									<span class="text-gray-300">{day.meals.lunch}</span>
								</div>
							{/if}
							{#if day.meals.dinner}
								<div class="text-sm flex items-start gap-2">
									<span class="text-red-400 font-medium">🍽️ Dinner:</span>
									<span class="text-gray-300">{day.meals.dinner}</span>
								</div>
							{/if}
						</CardContent>
					</Card>
				</div>
			{/if}

			<!-- Transportation & Accommodation -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#if day.transportation}
					<div>
						<h5 class="mb-2 text-sm font-medium text-gray-200 flex items-center gap-2">
							🚗 Transportation
						</h5>
						<Card class="bg-zinc-900 border-zinc-700">
							<CardContent class="p-3">
								<div class="text-sm text-gray-400">{day.transportation}</div>
							</CardContent>
						</Card>
					</div>
				{/if}
				
				{#if day.accommodation}
					<div>
						<h5 class="mb-2 text-sm font-medium text-gray-200 flex items-center gap-2">
							🏨 Accommodation
						</h5>
						<Card class="bg-zinc-900 border-zinc-700">
							<CardContent class="p-3">
								<div class="text-sm text-gray-400">{day.accommodation}</div>
							</CardContent>
						</Card>
					</div>
				{/if}
			</div>

			<!-- Daily Budget -->
			{#if day.budget_estimate}
				<div class="text-right">
					<Badge variant="outline" class="text-green-400 border-green-400/30">
						Daily Budget: {day.budget_estimate}
					</Badge>
				</div>
			{/if}
		</div>
	</Accordion.Content>
</Accordion.Item>