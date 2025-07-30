<script lang="ts">
	import { type Message } from '../chat-state.svelte';

	let {
		messages,
		isSubmitting = false
	}: {
		messages: Message[];
		isSubmitting?: boolean;
	} = $props();

	// Message auto-scrolling
	let chatContainer: HTMLElement;

	$effect(() => {
		if (messages.length && chatContainer) {
			setTimeout(() => {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}, 50);
		}
	});

	function formatMessageContent(content: string): string {
		// Simple formatting for better readability
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
</script>

<div
	bind:this={chatContainer}
	class="h-[calc(100vh-200px)] overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-800 p-4"
>
	{#each messages as message, i}
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
			</div>
		</div>
	{/each}

	{#if isSubmitting}
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
					<span class="text-sm text-gray-400">Finding perfect destinations for you...</span>
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
