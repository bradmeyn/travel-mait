<script lang="ts">
	import { X } from 'lucide-svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { AlertTriangle, Package } from 'lucide-svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import type { Itinerary } from '../chat-state.svelte';
	import ItineraryDay from './itinerary-day.svelte';

	interface Props {
		itinerary: Itinerary;
		onClose: () => void;
	}

	let { itinerary, onClose }: Props = $props();

	const budgetItems = itinerary.budget_breakdown ? [
		{ label: 'Accommodation', value: itinerary.budget_breakdown.accommodation, icon: '🏨' },
		{ label: 'Food', value: itinerary.budget_breakdown.food, icon: '🍽️' },
		{ label: 'Activities', value: itinerary.budget_breakdown.activities, icon: '🎯' },
		{ label: 'Transportation', value: itinerary.budget_breakdown.transportation, icon: '🚗' }
	] : [];
</script>

<div class="max-h-[80vh] overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-800 p-6">
	<!-- Header -->
	<div class="mb-6 border-b border-zinc-700 pb-4">
		<div class="flex items-start justify-between">
			<div>
				<h2 class="mb-2 text-2xl font-bold text-blue-300">{itinerary.title}</h2>
				<p class="mb-3 text-gray-400">{itinerary.overview}</p>
				<div class="flex flex-wrap gap-4 text-sm">
					<span class="rounded bg-blue-900/30 px-2 py-1">
						📅 {itinerary.duration} days
					</span>
					<span class="rounded bg-green-900/30 px-2 py-1">
						🎨 {itinerary.trip_style}
					</span>
					<span class="rounded bg-orange-900/30 px-2 py-1">
						🌤️ {itinerary.best_time_to_visit}
					</span>
				</div>
			</div>
			<button
				class="text-gray-400 hover:text-white transition-colors p-2"
				onclick={onClose}
			>
				<X class="h-5 w-5" />
			</button>
		</div>
	</div>

	<!-- Destinations Overview -->
	<div class="mb-6">
		<h3 class="mb-3 text-lg font-semibold text-gray-200">Your Journey</h3>
		<div class="flex flex-wrap gap-2">
			{#each itinerary.destinations as destination, i}
				<div class="min-w-[200px] flex-1 rounded-lg bg-zinc-700 p-3">
					<div class="font-medium text-white">{destination.city}</div>
					<div class="text-sm text-gray-400">{destination.country}</div>
					<div class="mt-1 text-xs text-blue-400">{destination.days_spent} days</div>
				</div>
				{#if i < itinerary.destinations.length - 1}
					<div class="flex items-center text-gray-500">→</div>
				{/if}
			{/each}
		</div>
	</div>

	<!-- Daily Itinerary -->
	<div class="mb-6">
		<h3 class="mb-4 text-lg font-semibold text-gray-200">Daily Itinerary</h3>
		
		<Accordion.Root class="space-y-3">
			{#each itinerary.daily_itinerary as day}
				<ItineraryDay {day} value="day-{day.day}" />
			{/each}
		</Accordion.Root>
	</div>

	<!-- Budget Breakdown -->
	{#if itinerary.budget_breakdown}
		<div class="mb-6">
			<h3 class="mb-3 text-lg font-semibold text-gray-200 flex items-center gap-2">
				💰 Budget Breakdown
			</h3>
			
			<Card class="bg-zinc-900 border-zinc-700">
				<CardHeader class="pb-3">
					<CardTitle class="text-gray-200 text-base">Estimated Costs</CardTitle>
				</CardHeader>
				
				<CardContent class="space-y-3">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
						{#each budgetItems as item}
							<div class="flex items-center justify-between p-2 rounded bg-zinc-800/50">
								<div class="flex items-center gap-2">
									<span class="text-sm">{item.icon}</span>
									<span class="text-sm text-gray-400">{item.label}:</span>
								</div>
								<span class="text-sm text-white font-medium">{item.value}</span>
							</div>
						{/each}
					</div>
					
					<Separator class="bg-zinc-700" />
					
					<div class="flex items-center justify-between p-3 rounded bg-green-900/20 border border-green-700/30">
						<span class="font-semibold text-gray-200">Total Estimate:</span>
						<span class="text-lg font-bold text-green-400">{itinerary.budget_breakdown.total_estimate}</span>
					</div>
				</CardContent>
			</Card>
		</div>
	{/if}

	<!-- Packing & Notes -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Packing Suggestions -->
		{#if itinerary.packing_suggestions?.length}
			<div>
				<Card class="bg-zinc-900 border-zinc-700">
					<CardHeader class="pb-3">
						<CardTitle class="text-gray-200 text-base flex items-center gap-2">
							<Package class="h-4 w-4" />
							Packing Suggestions
						</CardTitle>
					</CardHeader>
					
					<CardContent>
						<ul class="space-y-2">
							{#each itinerary.packing_suggestions as item}
								<li class="text-sm text-gray-400 flex items-start gap-2">
									<span class="text-blue-400 mt-0.5">•</span>
									<span>{item}</span>
								</li>
							{/each}
						</ul>
					</CardContent>
				</Card>
			</div>
		{/if}

		<!-- Important Notes -->
		{#if itinerary.important_notes?.length}
			<div>
				<h3 class="mb-3 text-lg font-semibold text-gray-200 flex items-center gap-2">
					<AlertTriangle class="h-5 w-5 text-orange-400" />
					Important Notes
				</h3>
				
				<div class="space-y-3">
					{#each itinerary.important_notes as note}
						<Alert class="bg-orange-900/20 border-orange-700/30">
							<AlertTriangle class="h-4 w-4 text-orange-400" />
							<AlertDescription class="text-orange-300 text-sm">
								{note}
							</AlertDescription>
						</Alert>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>