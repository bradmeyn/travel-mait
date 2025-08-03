<script lang="ts">
	import { getChatState, type Message, type Itinerary } from '../chat-state.svelte';

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
		// Truncate long messages for sidebar
		const truncated = content.length > 150 ? content.slice(0, 150) + '...' : content;
		return truncated
			.replace(/\n/g, ' ')
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

	function handleItinerarySelect(itinerary: Itinerary) {
		chat.setCurrentItinerary(itinerary);
	}

	function getItineraryVersion(itinerary: Itinerary): number {
		// Find which version this itinerary is based on creation order
		const itineraryIndex = chat.itineraries.findIndex((it) => it.id === itinerary.id);
		return itineraryIndex + 1;
	}
</script>

<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="border-b border-zinc-700 p-4">
		<h3 class="font-semibold text-white">Conversation</h3>
		<p class="mt-1 text-xs text-gray-400">{chat.messages.length} messages</p>
	</div>

	<!-- Messages -->
	<div bind:this={chatContainer} class="flex-1 space-y-3 overflow-y-auto p-4">
		{#each chat.messages as message, i}
			<div class="animate-fade-in" style="--delay: {i * 50}ms">
				<!-- Message Header -->
				<div class="mb-1 flex items-center gap-2 text-xs text-gray-400">
					<span>{getMessageIcon(message.role)}</span>
					<span>
						{message.role === 'user'
							? 'You'
							: message.role === 'assistant'
								? 'Assistant'
								: 'System'}
					</span>
					{#if message.timestamp}
						<span class="ml-auto">
							{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
						</span>
					{/if}
				</div>

				<!-- Message Content -->
				<div
					class={`rounded-lg p-3 text-sm ${
						message.role === 'user'
							? 'bg-zinc-700 text-gray-200'
							: message.role === 'system'
								? 'border border-red-700/30 bg-red-900/30 text-red-300'
								: 'border border-blue-700/30 bg-blue-900/30 text-blue-100'
					}`}
				>
					{@html formatMessageContent(message.content)}

					<!-- Itinerary Card -->
					{#if message.itinerary}
						<div class="mt-3 border-t border-current/20 pt-3">
							<div class="mb-2 flex items-center justify-between">
								<div class="text-xs font-medium">
									Itinerary v{getItineraryVersion(message.itinerary)}
								</div>
								<button
									class="rounded bg-blue-600 px-2 py-1 text-xs transition-colors hover:bg-blue-500"
									onclick={() => handleItinerarySelect(message.itinerary)}
								>
									View
								</button>
							</div>

							<div class="space-y-1 text-xs opacity-90">
								<div class="font-medium">{message.itinerary.title}</div>
								<div class="flex justify-between">
									<span>{message.itinerary.duration} days</span>
									<span>{message.itinerary.destinations.length} destinations</span>
								</div>
								{#if message.itinerary.budget_breakdown}
									<div class="text-green-400">
										{message.itinerary.budget_breakdown.total_estimate}
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/each}

		<!-- Loading State -->
		{#if chat.request.isLoading}
			<div class="animate-fade-in">
				<div class="mb-1 flex items-center gap-2 text-xs text-gray-400">
					<span>🌍</span>
					<span>Assistant</span>
				</div>
				<div class="rounded-lg border border-blue-700/30 bg-blue-900/30 p-3">
					<div class="flex items-center gap-2">
						<div class="typing-indicator">
							<span class="h-1 w-1 rounded-full bg-orange-400 opacity-60"></span>
							<span class="h-1 w-1 rounded-full bg-orange-400 opacity-60"></span>
							<span class="h-1 w-1 rounded-full bg-orange-400 opacity-60"></span>
						</div>
						<span class="text-xs text-gray-300">Creating itinerary...</span>
					</div>
				</div>
			</div>
		{/if}

		<!-- Error State -->
		{#if chat.request.error}
			<div class="animate-fade-in">
				<div class="rounded-lg border border-red-700/30 bg-red-900/30 p-3 text-red-300">
					<div class="flex items-center gap-2">
						<span class="text-xs">⚠️</span>
						<span class="text-xs">{chat.request.error}</span>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Itinerary History -->
	{#if chat.itineraries.length > 1}
		<div class="border-t border-zinc-700 p-4">
			<h4 class="mb-2 text-sm font-medium text-gray-300">Previous Versions</h4>
			<div class="space-y-2">
				{#each chat.itineraries.slice(0, -1).reverse() as itinerary, i}
					<button
						class="w-full rounded bg-zinc-700 p-2 text-left transition-colors hover:bg-zinc-600"
						onclick={() => handleItinerarySelect(itinerary)}
					>
						<div class="truncate text-xs text-gray-300">
							{itinerary.title}
						</div>
						<div class="text-xs text-gray-500">
							v{chat.itineraries.length - 1 - i} • {itinerary.duration} days
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(4px);
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
		gap: 2px;
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
