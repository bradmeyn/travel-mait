<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import PromptInput from '../_components/PromptInput.svelte';

	// Get chatId from route parameters using Svelte 5 reactive declarations
	const chatId = 'test-chat-id'; // Replace with actual chatId from route params

	// Chat state using Svelte 5 fine-grained reactivity
	let messages = $state([
		{
			role: 'system',
			content: 'How can I help you today?'
		}
	]);
	let prompt = $state('');
	let isSubmitting = $state(false);
	let isLoadingHistory = $state(true);

	// Message auto-scrolling
	let chatContainer: HTMLElement;

	// Svelte 5 reactive effect for scrolling
	$effect(() => {
		if (messages.length && chatContainer) {
			setTimeout(() => {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}, 50);
		}
	});

	onMount(async () => {
		// Check for initial prompt from URL (when redirected from new chat)
		const initialPrompt = new URLSearchParams(window.location.search).get('initial');

		// Load existing messages or start with initial prompt
		try {
			// In a real app, fetch existing messages from API
			// const response = await fetch(`/api/chat/${chatId}`);
			// messages = await response.json();

			// Simulate loading delay
			await new Promise((resolve) => setTimeout(resolve, 600));

			// If this is a new chat with an initial prompt, process it
			if (initialPrompt) {
				messages = [{ role: 'system', content: 'How can I help you today?' }];
				// Simulate sending the initial prompt
				handleInitialPrompt(initialPrompt);
			} else {
				// Simulated chat history
				messages = [
					{ role: 'system', content: 'How can I help you today?' },
					{
						role: 'user',
						content: 'Sample chat history - this would be loaded from your backend.'
					},
					{
						role: 'assistant',
						content: 'This is a placeholder response to demonstrate the chat interface.'
					}
				];
			}
		} catch (error) {
			console.error('Error loading chat:', error);
			messages = [{ role: 'system', content: 'Error loading chat. Please try again.' }];
		} finally {
			isLoadingHistory = false;
		}
	});

	async function handleInitialPrompt(initialText: string) {
		// Add user message
		messages = [...messages, { role: 'user', content: initialText }];

		// Simulate API response
		isSubmitting = true;
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Add AI response
		messages = [
			...messages,
			{
				role: 'assistant',
				content: `I received your question: "${initialText}". This is a simulated response for the chat interface demo.`
			}
		];
		isSubmitting = false;
	}

	async function handleSubmit() {
		if (!prompt.trim()) return;

		// Add user message
		messages = [...messages, { role: 'user', content: prompt }];

		// Save current prompt and clear input
		const currentPrompt = prompt;
		prompt = '';

		// Start loading state
		isSubmitting = true;

		try {
			// This would be your actual API call
			// const response = await fetch(`/api/chat/${chatId}/message`, {
			//   method: 'POST',
			//   body: JSON.stringify({ prompt: currentPrompt }),
			//   headers: { 'Content-Type': 'application/json' }
			// });
			// const data = await response.json();

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Add simulated AI response
			messages = [
				...messages,
				{
					role: 'assistant',
					content: `I received your message: "${currentPrompt}". This is a simulated response.`
				}
			];
		} catch (error) {
			console.error('Error sending message:', error);
			messages = [
				...messages,
				{
					role: 'system',
					content: 'Error sending message. Please try again.'
				}
			];
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="mx-auto mt-6 max-w-3xl">
	<div class="mb-4 flex items-center justify-between">
		<h1 class="text-2xl font-bold">
			<a href="/" class="hover:text-gray-300">chapp</a>
			<span class="text-gray-500">/</span>
			<span class="text-lg text-gray-400">{chatId}</span>
		</h1>
		<a href="/" class="rounded bg-[#323654] px-3 py-1 text-sm hover:bg-[#3A4066]">New Chat</a>
	</div>

	<!-- Chat messages container -->
	<div
		bind:this={chatContainer}
		class="mb-4 h-[calc(100vh-240px)] overflow-y-auto rounded border border-gray-700 bg-[#252842] p-4"
	>
		{#if isLoadingHistory}
			<div class="flex h-full items-center justify-center">
				<svg
					class="h-6 w-6 animate-spin text-gray-400"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			</div>
		{:else}
			{#each messages as message, i}
				<div class="animate-fade-in mb-4" style="--delay: {i * 100}ms">
					<div class="mb-1 text-xs text-gray-400">
						{message.role === 'user' ? 'You' : message.role === 'system' ? 'System' : 'AI'}
					</div>
					<div
						class={`rounded-lg p-3 ${message.role === 'user' ? 'ml-8 bg-[#1E2031]' : message.role === 'system' ? 'bg-gray-700' : 'mr-8 bg-[#323654]'}`}
					>
						{message.content}
					</div>
				</div>
			{/each}

			{#if isSubmitting}
				<div class="mb-4">
					<div class="mb-1 text-xs text-gray-400">AI</div>
					<div class="mr-8 rounded-lg bg-[#323654] p-3">
						<div class="flex items-center">
							<div class="typing-indicator">
								<span class="bg-opacity-60 mr-1 inline-block h-2 w-2 rounded-full bg-white"></span>
								<span class="bg-opacity-60 mr-1 inline-block h-2 w-2 rounded-full bg-white"></span>
								<span class="bg-opacity-60 mr-1 inline-block h-2 w-2 rounded-full bg-white"></span>
							</div>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>

	<!-- Prompt input form -->
	<div class="overflow-hidden rounded border border-gray-700 bg-[#252842]">
		<PromptInput bind:prompt onsubmit={handleSubmit} />
	</div>
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
