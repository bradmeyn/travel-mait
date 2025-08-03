<script lang="ts">
	import {
		getChatState,
		type Message,
		type Itinerary,
		type DayItinerary
	} from '../chat-state.svelte';

	const chat = getChatState();

	// Message auto-scrolling
	let chatContainer: HTMLElement;

	$effect(() => {
		if (chat.messages.length && chatContainer) {
			setTimeout(() => {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}, 50);
		}
	});

	function formatMessageContent(content: string): string {
		return content
			.replace(/\n/g, '<br>')
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.*?)\*/g, '<em>$1</em>');
	}

	function getMessageIcon(role: string): string {
		switch (role) {
			case 'user':
				return '👤';
			case 'assistant':
				return '🌍';
			case 'system':
				return '⚠️';
			default:
				return '';
		}
	}

	function formatCurrency(amount: string): string {
		return amount.replace(/€(\d+)-(\d+)/, '€$1-$2');
	}

	function handleItinerarySelect(itinerary: Itinerary) {
		chat.setCurrentItinerary(itinerary);
	}
</script>

<div
	bind:this={chatContainer}
	class="h-[calc(60vh-200px)] overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-800 p-4"
>
	{#each chat.messages as message, i}
		<div class="animate-fade-in mb-6" style="--delay: {i * 100}ms">
			<div class="mb-2 flex items-center text-sm text-gray-400">
				<span class="mr-2">{getMessageIcon(message.role)}</span>
				<span>
					{message.role === 'user'
						? 'You'
						: message.role === 'assistant'
							? 'Travel Assistant'
							: 'System'}
				</span>
				{#if message.timestamp}
					<span class="ml-auto text-xs opacity-60">
						{message.timestamp.toLocaleTimeString()}
					</span>
				{/if}
			</div>

			<div
				class={`rounded-lg p-4 ${
					message.role === 'user'
						? 'border border-zinc-700 bg-zinc-800'
						: message.role === 'system'
							? 'border border-red-700/30 bg-red-900/20 text-red-300'
							: 'border border-gray-600 bg-[#252842]'
				}`}
			>
				{@html formatMessageContent(message.content)}

				<!-- Display itinerary if attached to message -->
				{#if message.itinerary}
					<div class="mt-4 rounded-lg border border-blue-400/30 bg-blue-900/10 p-4">
						<div class="mb-3 flex items-center justify-between">
							<h3 class="text-lg font-semibold text-blue-300">{message.itinerary.title}</h3>
							<button
								class="rounded bg-blue-600 px-3 py-1 text-xs transition-colors hover:bg-blue-500"
								onclick={() => handleItinerarySelect(message.itinerary)}
							>
								View Details
							</button>
						</div>

						<div class="mb-3 text-sm text-gray-300">
							<p><strong>Duration:</strong> {message.itinerary.duration} days</p>
							<p><strong>Style:</strong> {message.itinerary.trip_style}</p>
							<p>
								<strong>Destinations:</strong>
								{message.itinerary.destinations.map((d) => `${d.city}, ${d.country}`).join(' → ')}
							</p>
						</div>

						<div class="text-sm text-gray-400">
							<p>{message.itinerary.overview}</p>
						</div>

						<!-- Quick day preview -->
						<div class="mt-3 max-h-32 overflow-y-auto">
							<h4 class="mb-2 text-sm font-medium text-gray-300">Daily Preview:</h4>
							<div class="space-y-1">
								{#each message.itinerary.daily_itinerary.slice(0, 3) as day}
									<div class="rounded bg-black/20 p-2 text-xs">
										<span class="font-medium text-blue-300">Day {day.day}:</span>
										<span class="text-gray-400">{day.location} - {day.theme}</span>
									</div>
								{/each}
								{#if message.itinerary.daily_itinerary.length > 3}
									<div class="py-1 text-center text-xs text-gray-500">
										...and {message.itinerary.daily_itinerary.length - 3} more days
									</div>
								{/if}
							</div>
						</div>

						<!-- Budget info if available -->
						{#if message.itinerary.budget_breakdown}
							<div class="mt-3 rounded bg-green-900/20 p-2">
								<div class="text-xs text-green-300">
									<strong>Estimated Total:</strong>
									{message.itinerary.budget_breakdown.total_estimate}
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/each}

	{#if chat.request.isLoading}
		<div class="mb-6">
			<div class="mb-2 flex items-center text-sm text-gray-400">
				<span class="mr-2">🌍</span>
				<span>Travel Assistant</span>
			</div>
			<div class="rounded-lg border border-gray-600 bg-[#252842] p-4">
				<div class="flex items-center">
					<div class="typing-indicator mr-3">
						<span class="mr-1 inline-block h-2 w-2 rounded-full bg-orange-400 opacity-60"></span>
						<span class="mr-1 inline-block h-2 w-2 rounded-full bg-orange-400 opacity-60"></span>
						<span class="mr-1 inline-block h-2 w-2 rounded-full bg-orange-400 opacity-60"></span>
					</div>
					<span class="text-sm text-gray-400">Crafting your perfect itinerary...</span>
				</div>
			</div>
		</div>
	{/if}

	{#if chat.request.error}
		<div class="mb-6">
			<div class="rounded-lg border border-red-700/30 bg-red-900/20 p-3 text-red-300">
				<div class="flex items-center">
					<span class="mr-2">⚠️</span>
					<span class="text-sm">{chat.request.error}</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes bounce {
		0%,
		80%,
		100% {
			transform: scale(0);
		}
		40% {
			transform: scale(1);
		}
	}

	.animate-fade-in {
		opacity: 0;
		animation: fade-in 0.3s ease-out forwards;
		animation-delay: var(--delay, 0ms);
	}

	.typing-indicator {
		display: flex;
		align-items: center;
	}

	.typing-indicator span {
		animation: bounce 1.2s infinite ease-in-out;
	}

	.typing-indicator span:nth-child(1) {
		animation-delay: -0.32s;
	}

	.typing-indicator span:nth-child(2) {
		animation-delay: -0.16s;
	}
</style>
