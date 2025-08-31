<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import type { DayItinerary } from '$lib/schemas/itinerary';
	import ItineraryActivity from './itinerary-activity.svelte';

	interface Props {
		day: DayItinerary;
	}

	let { day }: Props = $props();
</script>

<Accordion.Item>
	<Accordion.Trigger class="w-full rounded-lg p-4 text-left transition-colors hover:bg-zinc-700/50">
		<div class="flex w-full items-center justify-between">
			<div>
				<h4 class="font-semibold text-white">Day {day.day}: {day.location}</h4>
				<p class="text-sm text-gray-400">{day.theme}</p>
			</div>
		</div>
	</Accordion.Trigger>

	<Accordion.Content class="border-t border-zinc-700 bg-zinc-800/50">
		<div class="space-y-4 p-4">
			<!-- Activities -->
			<div>
				<h5 class="mb-3 flex items-center gap-2 font-medium text-gray-200">🎯 Activities</h5>
				<div class="space-y-3">
					{#each day.activities as activity}
						<ItineraryActivity {activity} />
					{/each}
				</div>
			</div>

			<!-- Meals -->
			{#if day.meals}
				<div>
					<h5 class="mb-3 flex items-center gap-2 font-medium text-gray-200">🍽️ Meals</h5>
					<Card class="border-zinc-700 bg-zinc-900">
						<CardContent class="space-y-2 p-3">
							{#if day.meals.breakfast}
								<div class="flex items-start gap-2 text-sm">
									<span class="font-medium text-orange-400">🥞 Breakfast:</span>
									<span class="text-gray-300">{day.meals.breakfast}</span>
								</div>
							{/if}
							{#if day.meals.lunch}
								<div class="flex items-start gap-2 text-sm">
									<span class="font-medium text-yellow-400">🥗 Lunch:</span>
									<span class="text-gray-300">{day.meals.lunch}</span>
								</div>
							{/if}
							{#if day.meals.dinner}
								<div class="flex items-start gap-2 text-sm">
									<span class="font-medium text-red-400">🍽️ Dinner:</span>
									<span class="text-gray-300">{day.meals.dinner}</span>
								</div>
							{/if}
						</CardContent>
					</Card>
				</div>
			{/if}

			<!-- Transportation & Accommodation -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{#if day.transportation}
					<div>
						<h5 class="mb-2 flex items-center gap-2 text-sm font-medium text-gray-200">
							🚗 Transportation
						</h5>
						<Card class="border-zinc-700 bg-zinc-900">
							<CardContent class="p-3">
								<div class="text-sm text-gray-400">{day.transportation}</div>
							</CardContent>
						</Card>
					</div>
				{/if}

				{#if day.accommodation}
					<div>
						<h5 class="mb-2 flex items-center gap-2 text-sm font-medium text-gray-200">
							🏨 Accommodation
						</h5>
						<Card class="border-zinc-700 bg-zinc-900">
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
					<Badge variant="outline" class="border-green-400/30 text-green-400">
						Daily Budget: {day.budget_estimate}
					</Badge>
				</div>
			{/if}
		</div>
	</Accordion.Content>
</Accordion.Item>
