<script lang="ts">
	import { getChatState, type Itinerary, type DayItinerary } from '../chat-state.svelte';

	const chat = getChatState();

	let selectedDay: number | null = null;

	function selectDay(dayNumber: number) {
		selectedDay = selectedDay === dayNumber ? null : dayNumber;
	}

	function formatTime(time: string): string {
		return time.replace(/(\d{1,2}):(\d{2})\s*(AM|PM)/i, '$1:$2 $3');
	}
</script>

{#if chat.currentItinerary}
	<div class="max-h-[80vh] overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-800 p-6">
		<!-- Header -->
		<div class="mb-6 border-b border-zinc-700 pb-4">
			<div class="flex items-start justify-between">
				<div>
					<h2 class="mb-2 text-2xl font-bold text-blue-300">{chat.currentItinerary.title}</h2>
					<p class="mb-3 text-gray-400">{chat.currentItinerary.overview}</p>
					<div class="flex flex-wrap gap-4 text-sm">
						<span class="rounded bg-blue-900/30 px-2 py-1">
							📅 {chat.currentItinerary.duration} days
						</span>
						<span class="rounded bg-green-900/30 px-2 py-1">
							🎨 {chat.currentItinerary.trip_style}
						</span>
						<span class="rounded bg-orange-900/30 px-2 py-1">
							🌤️ {chat.currentItinerary.best_time_to_visit}
						</span>
					</div>
				</div>
				<button
					class="text-gray-400 hover:text-white"
					on:click={() => chat.setCurrentItinerary(null)}
				>
					✕
				</button>
			</div>
		</div>

		<!-- Destinations Overview -->
		<div class="mb-6">
			<h3 class="mb-3 text-lg font-semibold text-gray-200">Your Journey</h3>
			<div class="flex flex-wrap gap-2">
				{#each chat.currentItinerary.destinations as destination, i}
					<div class="min-w-[200px] flex-1 rounded-lg bg-zinc-700 p-3">
						<div class="font-medium text-white">{destination.city}</div>
						<div class="text-sm text-gray-400">{destination.country}</div>
						<div class="mt-1 text-xs text-blue-400">{destination.days_spent} days</div>
					</div>
					{#if i < chat.currentItinerary.destinations.length - 1}
						<div class="flex items-center text-gray-500">→</div>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Daily Itinerary -->
		<div class="mb-6">
			<h3 class="mb-4 text-lg font-semibold text-gray-200">Daily Itinerary</h3>
			<div class="space-y-3">
				{#each chat.currentItinerary.daily_itinerary as day}
					<div class="overflow-hidden rounded-lg border border-zinc-700">
						<button
							class="bg-zinc-750 w-full p-4 text-left transition-colors hover:bg-zinc-700"
							on:click={() => selectDay(day.day)}
						>
							<div class="flex items-center justify-between">
								<div>
									<h4 class="font-semibold text-white">Day {day.day}: {day.location}</h4>
									<p class="text-sm text-gray-400">{day.theme}</p>
								</div>
								<div class="text-gray-400">
									{selectedDay === day.day ? '▼' : '▶'}
								</div>
							</div>
						</button>

						{#if selectedDay === day.day}
							<div class="border-t border-zinc-700 bg-zinc-800 p-4">
								<!-- Activities -->
								<div class="mb-4">
									<h5 class="mb-2 font-medium text-gray-200">Activities</h5>
									<div class="space-y-3">
										{#each day.activities as activity}
											<div class="rounded bg-zinc-900 p-3">
												<div class="mb-2 flex items-start justify-between">
													<div>
														<span class="text-sm font-medium text-blue-400"
															>{formatTime(activity.time)}</span
														>
														<span class="ml-2 text-sm text-gray-400">({activity.duration})</span>
													</div>
													{#if activity.cost}
														<span class="text-xs text-green-400">{activity.cost}</span>
													{/if}
												</div>
												<h6 class="mb-1 font-medium text-white">{activity.title}</h6>
												<p class="mb-2 text-sm text-gray-400">{activity.description}</p>
												{#if activity.tips}
													<div class="rounded bg-yellow-900/20 p-2 text-xs text-yellow-400">
														💡 {activity.tips}
													</div>
												{/if}
											</div>
										{/each}
									</div>
								</div>

								<!-- Meals -->
								{#if day.meals}
									<div class="mb-4">
										<h5 class="mb-2 font-medium text-gray-200">Meals</h5>
										<div class="space-y-1 rounded bg-zinc-900 p-3">
											{#if day.meals.breakfast}
												<div class="text-sm">
													<span class="text-orange-400">🥞 Breakfast:</span>
													{day.meals.breakfast}
												</div>
											{/if}
											{#if day.meals.lunch}
												<div class="text-sm">
													<span class="text-yellow-400">🥗 Lunch:</span>
													{day.meals.lunch}
												</div>
											{/if}
											{#if day.meals.dinner}
												<div class="text-sm">
													<span class="text-red-400">🍽️ Dinner:</span>
													{day.meals.dinner}
												</div>
											{/if}
										</div>
									</div>
								{/if}

								<!-- Transportation & Accommodation -->
								<div class="flex gap-4">
									{#if day.transportation}
										<div class="flex-1">
											<h5 class="mb-1 text-sm font-medium text-gray-200">Transportation</h5>
											<div class="rounded bg-zinc-900 p-2 text-sm text-gray-400">
												🚗 {day.transportation}
											</div>
										</div>
									{/if}
									{#if day.accommodation}
										<div class="flex-1">
											<h5 class="mb-1 text-sm font-medium text-gray-200">Accommodation</h5>
											<div class="rounded bg-zinc-900 p-2 text-sm text-gray-400">
												🏨 {day.accommodation}
											</div>
										</div>
									{/if}
								</div>

								{#if day.budget_estimate}
									<div class="mt-3 text-right">
										<span class="text-sm font-medium text-green-400"
											>Daily Budget: {day.budget_estimate}</span
										>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Budget Breakdown -->
		{#if chat.currentItinerary.budget_breakdown}
			<div class="mb-6">
				<h3 class="mb-3 text-lg font-semibold text-gray-200">Budget Breakdown</h3>
				<div class="rounded-lg bg-zinc-900 p-4">
					<div class="mb-3 grid grid-cols-2 gap-4">
						<div class="text-sm">
							<span class="text-gray-400">Accommodation:</span>
							<span class="ml-2 text-white"
								>{chat.currentItinerary.budget_breakdown.accommodation}</span
							>
						</div>
						<div class="text-sm">
							<span class="text-gray-400">Food:</span>
							<span class="ml-2 text-white">{chat.currentItinerary.budget_breakdown.food}</span>
						</div>
						<div class="text-sm">
							<span class="text-gray-400">Activities:</span>
							<span class="ml-2 text-white"
								>{chat.currentItinerary.budget_breakdown.activities}</span
							>
						</div>
						<div class="text-sm">
							<span class="text-gray-400">Transportation:</span>
							<span class="ml-2 text-white"
								>{chat.currentItinerary.budget_breakdown.transportation}</span
							>
						</div>
					</div>
					<div class="border-t border-zinc-700 pt-3">
						<div class="text-lg font-semibold">
							<span class="text-gray-400">Total Estimate:</span>
							<span class="ml-2 text-green-400"
								>{chat.currentItinerary.budget_breakdown.total_estimate}</span
							>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Packing & Notes -->
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			{#if chat.currentItinerary.packing_suggestions?.length}
				<div>
					<h3 class="mb-3 text-lg font-semibold text-gray-200">Packing Suggestions</h3>
					<div class="rounded-lg bg-zinc-900 p-4">
						<ul class="space-y-1">
							{#each chat.currentItinerary.packing_suggestions as item}
								<li class="text-sm text-gray-400">• {item}</li>
							{/each}
						</ul>
					</div>
				</div>
			{/if}

			{#if chat.currentItinerary.important_notes?.length}
				<div>
					<h3 class="mb-3 text-lg font-semibold text-gray-200">Important Notes</h3>
					<div class="rounded-lg bg-orange-900/20 p-4">
						<ul class="space-y-2">
							{#each chat.currentItinerary.important_notes as note}
								<li class="text-sm text-orange-300">⚠️ {note}</li>
							{/each}
						</ul>
					</div>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div class="rounded-lg border border-zinc-700 bg-zinc-800 p-8 text-center">
		<div class="mb-4 text-gray-400">
			<svg class="mx-auto mb-4 h-16 w-16 opacity-50" fill="currentColor" viewBox="0 0 20 20">
				<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		</div>
		<h3 class="mb-2 text-lg font-semibold text-gray-300">No Itinerary Selected</h3>
		<p class="text-gray-500">Select an itinerary from the chat to view detailed information</p>
	</div>
{/if}
