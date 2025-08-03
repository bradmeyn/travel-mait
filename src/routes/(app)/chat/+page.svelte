<script lang="ts">
	import PromptInput from './_components/prompt-input.svelte';
	import ChatSidebar from './_components/chat-sidebar.svelte';
	import ItineraryViewer from './_components/itinerary-viewer.svelte';
	import { setChatState, testItinerary } from './chat-state.svelte';
	import { onMount } from 'svelte';

	let chat = setChatState();
	let showChatSidebar = $state(true);

	// In your test component or development tools
	function addTestItinerary() {
		// Simulate user request
		chat.addMessage({
			role: 'user',
			content: 'I want a relaxing European vacation that includes Cinque Terre for 14 days'
		});

		// Add the test itinerary
		chat.addMessage({
			role: 'assistant',
			content: `I've created your 14-day relaxing Italian itinerary: "${testItinerary.title}"`,
			itinerary: testItinerary
		});

		// Set as current itinerary
		chat.addItinerary(testItinerary);
	}

	onMount(() => {
		// Automatically add a test itinerary on mount for demo purposes
		addTestItinerary();
	});
</script>

<!-- Header -->

<div class="flex h-[calc(100vh-80px)]">
	<!-- Chat Sidebar -->
	{#if chat.messages.length > 0 && showChatSidebar}
		<div class="w-80 border-r border-zinc-700 bg-zinc-800">
			<ChatSidebar />
		</div>
	{/if}

	<!-- Main Content Area -->
	<div class="flex flex-1 flex-col">
		{#if chat.currentItinerary}
			<!-- Itinerary Viewer (Main Content) -->
			<div class="flex-1 overflow-hidden">
				<ItineraryViewer />
			</div>
		{:else}
			<!-- Welcome State -->
			<div class="flex flex-1 items-center justify-center p-8">
				<div class="max-w-2xl text-center">
					<div class="mb-8">
						<div class="mb-4 text-6xl">✈️</div>
						<h2 class="mb-4 text-3xl font-bold text-white">Where would you like to go?</h2>
						<p class="text-lg text-gray-400">
							Describe your dream trip and I'll create a detailed itinerary just for you.
						</p>
					</div>

					{#if chat.request.error}
						<div class="mb-6 rounded-lg border border-red-700/30 bg-red-900/20 p-4 text-red-300">
							<div class="flex items-center">
								<span class="mr-2">⚠️</span>
								<span>Error: {chat.request.error}</span>
							</div>
						</div>
					{/if}

					<!-- Embedded Prompt Input for Welcome State -->
					<div class="mx-auto max-w-xl">
						<PromptInput />
					</div>
				</div>
			</div>
		{/if}

		<!-- Bottom Prompt Input (when itinerary is shown) -->
		{#if chat.currentItinerary}
			<div class="border-t border-zinc-700 bg-zinc-800 p-4">
				<div class="mx-auto max-w-4xl">
					<PromptInput placeholder="Ask me to modify your itinerary..." />
				</div>
			</div>
		{/if}
	</div>
</div>
