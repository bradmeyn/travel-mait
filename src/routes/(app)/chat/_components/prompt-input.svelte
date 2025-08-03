<script lang="ts">
	import { SendHorizontal, Calendar, MapPin, DollarSign, Users, Sparkles } from 'lucide-svelte';
	import { getChatState } from '../chat-state.svelte';
	import LoadingSpinner from './loading-spinner.svelte';

	interface Props {
		placeholder?: string;
	}

	let { placeholder = 'Describe your dream trip...' }: Props = $props();

	const chat = getChatState();

	// Form state
	let showAdvanced = $state(false);
	let prompt = $state('');
	let minDays = $state<number | undefined>(undefined);
	let maxDays = $state<number | undefined>(undefined);
	let budget = $state('');
	let travelers = $state<number | undefined>(undefined);
	let travelStyle = $state('');
	let mustInclude = $state('');
	let timeOfYear = $state('');
	let interests = $state<string[]>([]);

	// Context-aware behavior
	const isRefinement = $derived(chat.currentItinerary !== null);
	const isFirstMessage = $derived(chat.messages.length === 0);

	const travelStyles = [
		'Relaxing',
		'Adventure',
		'Cultural',
		'Romantic',
		'Family-friendly',
		'Backpacker',
		'Luxury',
		'Food & Wine',
		'Photography',
		'Beach'
	];

	const interestOptions = [
		'Museums',
		'Hiking',
		'Food tours',
		'Nightlife',
		'Shopping',
		'Architecture',
		'Nature',
		'History',
		'Art',
		'Local experiences',
		'Photography',
		'Wellness/Spa',
		'Beaches',
		'Mountains'
	];

	function toggleInterest(interest: string) {
		if (interests.includes(interest)) {
			interests = interests.filter((i) => i !== interest);
		} else {
			interests = [...interests, interest];
		}
	}

	function buildStructuredPrompt(): string {
		let structuredPrompt = prompt;

		if (
			minDays ||
			maxDays ||
			budget ||
			travelers ||
			travelStyle ||
			mustInclude ||
			timeOfYear ||
			interests.length > 0
		) {
			structuredPrompt += '\n\nAdditional details:';

			if (minDays || maxDays) {
				if (minDays && maxDays) {
					structuredPrompt += `\n• Duration: ${minDays}-${maxDays} days`;
				} else if (minDays) {
					structuredPrompt += `\n• Minimum duration: ${minDays} days`;
				} else if (maxDays) {
					structuredPrompt += `\n• Maximum duration: ${maxDays} days`;
				}
			}

			if (travelers) {
				structuredPrompt += `\n• Number of travelers: ${travelers}`;
			}

			if (budget) {
				structuredPrompt += `\n• Budget: ${budget}`;
			}

			if (travelStyle) {
				structuredPrompt += `\n• Travel style: ${travelStyle}`;
			}

			if (timeOfYear) {
				structuredPrompt += `\n• Time of year: ${timeOfYear}`;
			}

			if (mustInclude) {
				structuredPrompt += `\n• Must include: ${mustInclude}`;
			}

			if (interests.length > 0) {
				structuredPrompt += `\n• Interests: ${interests.join(', ')}`;
			}
		}

		return structuredPrompt;
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!prompt.trim()) return;

		const finalPrompt = buildStructuredPrompt();
		console.log('Submitting structured prompt:', finalPrompt);

		if (isRefinement) {
			await chat.refineItinerary(finalPrompt);
		} else {
			await chat.generateItinerary(finalPrompt);
		}

		// Reset form
		resetForm();
	}

	function resetForm() {
		prompt = '';
		minDays = undefined;
		maxDays = undefined;
		budget = '';
		travelers = undefined;
		travelStyle = '';
		mustInclude = '';
		timeOfYear = '';
		interests = [];
		showAdvanced = false;
	}

	let textareaRef: HTMLTextAreaElement;

	function autoResize() {
		if (textareaRef) {
			textareaRef.style.height = 'auto';
			textareaRef.style.height = `${Math.min(120, textareaRef.scrollHeight)}px`;
		}
	}

	// Context-aware quick prompts
	const initialPrompts = [
		'A relaxing European vacation including Cinque Terre',
		'Adventure trip through Southeast Asia',
		'Romantic getaway to Paris and Tuscany',
		'Family vacation to Japan with kids',
		'Food and wine tour of Spain'
	];

	const refinementPrompts = [
		'Add more time for relaxation',
		'Include cooking classes',
		'Reduce the budget',
		'Add more adventure activities',
		'Focus on local experiences'
	];

	const quickPrompts = $derived(isRefinement ? refinementPrompts : initialPrompts);

	function useQuickPrompt(suggestion: string) {
		prompt = suggestion;
		autoResize();
	}
</script>

<div class="w-full">
	<!-- Quick Suggestions (only show for first message or if no advanced options) -->
	{#if !prompt && !showAdvanced && (isFirstMessage || !isRefinement)}
		<div class="mb-4">
			<h3 class="mb-3 text-sm font-medium text-gray-400">
				{isRefinement ? 'Quick refinements:' : 'Quick suggestions:'}
			</h3>
			<div class="flex flex-wrap gap-2">
				{#each quickPrompts as suggestion}
					<button
						type="button"
						onclick={() => useQuickPrompt(suggestion)}
						class="rounded-full bg-zinc-700 px-3 py-2 text-xs text-gray-300 transition-colors hover:bg-zinc-600 hover:text-white"
					>
						{suggestion}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<form class="space-y-4" onsubmit={handleSubmit}>
		<!-- Main Prompt -->
		<div
			class="relative overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 transition-all focus-within:border-transparent focus-within:ring-2 focus-within:ring-orange-500/50"
		>
			<textarea
				bind:value={prompt}
				bind:this={textareaRef}
				oninput={autoResize}
				{placeholder}
				class="max-h-[120px] min-h-[56px] w-full resize-none overflow-y-auto bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
				rows="1"
				required
			></textarea>
		</div>

		<!-- Action Bar -->
		<div class="flex items-center justify-between">
			<!-- Advanced Options Toggle (only for initial creation) -->
			{#if !isRefinement}
				<button
					type="button"
					onclick={() => (showAdvanced = !showAdvanced)}
					class="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
				>
					<Sparkles class="size-4" />
					{showAdvanced ? 'Hide' : 'Show'} advanced options
				</button>
			{:else}
				<div class="text-sm text-gray-400">
					Refining: {chat.currentItinerary?.title}
				</div>
			{/if}

			<button
				type="submit"
				disabled={!prompt.trim() || chat.request.isLoading}
				class="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if chat.request.isLoading}
					<LoadingSpinner />
					{isRefinement ? 'Updating...' : 'Creating...'}
				{:else}
					<SendHorizontal class="size-4" />
					{isRefinement ? 'Update Itinerary' : 'Generate Itinerary'}
				{/if}
			</button>
		</div>

		<!-- Advanced Options (only for initial creation) -->
		{#if showAdvanced && !isRefinement}
			<div class="space-y-4 rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
				<h3 class="flex items-center gap-2 text-lg font-medium text-white">
					<Sparkles class="size-5" />
					Customize Your Trip
				</h3>

				<!-- Duration -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label class="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
							<Calendar class="size-4" />
							Duration
						</label>
						<div class="flex gap-2">
							<div class="flex-1">
								<input
									type="number"
									bind:value={minDays}
									placeholder="Min days"
									min="1"
									max="365"
									class="w-full rounded border border-zinc-600 bg-zinc-700 px-3 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
								/>
							</div>
							<span class="self-center text-gray-400">to</span>
							<div class="flex-1">
								<input
									type="number"
									bind:value={maxDays}
									placeholder="Max days"
									min="1"
									max="365"
									class="w-full rounded border border-zinc-600 bg-zinc-700 px-3 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
								/>
							</div>
						</div>
					</div>

					<div>
						<label class="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
							<Users class="size-4" />
							Travelers
						</label>
						<input
							type="number"
							bind:value={travelers}
							placeholder="Number of people"
							min="1"
							max="20"
							class="w-full rounded border border-zinc-600 bg-zinc-700 px-3 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
						/>
					</div>
				</div>

				<!-- Budget & Style -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label class="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
							<DollarSign class="size-4" />
							Budget
						</label>
						<input
							type="text"
							bind:value={budget}
							placeholder="e.g., €3000, $5000, Budget-friendly"
							class="w-full rounded border border-zinc-600 bg-zinc-700 px-3 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
						/>
					</div>

					<div>
						<label class="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
							<Sparkles class="size-4" />
							Travel Style
						</label>
						<select
							bind:value={travelStyle}
							class="w-full rounded border border-zinc-600 bg-zinc-700 px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
						>
							<option value="">Select style...</option>
							{#each travelStyles as style}
								<option value={style}>{style}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Time of Year & Must Include -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label class="mb-2 block text-sm font-medium text-gray-300"> Time of Year </label>
						<input
							type="text"
							bind:value={timeOfYear}
							placeholder="e.g., June 2025, Summer, Spring"
							class="w-full rounded border border-zinc-600 bg-zinc-700 px-3 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
						/>
					</div>

					<div>
						<label class="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
							<MapPin class="size-4" />
							Must Include
						</label>
						<input
							type="text"
							bind:value={mustInclude}
							placeholder="e.g., Paris, Machu Picchu, Tokyo"
							class="w-full rounded border border-zinc-600 bg-zinc-700 px-3 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
						/>
					</div>
				</div>

				<!-- Interests -->
				<div>
					<label class="mb-3 block text-sm font-medium text-gray-300">
						Interests & Activities
					</label>
					<div class="flex flex-wrap gap-2">
						{#each interestOptions as interest}
							<button
								type="button"
								onclick={() => toggleInterest(interest)}
								class={`rounded-full px-3 py-1 text-xs transition-colors ${
									interests.includes(interest)
										? 'bg-orange-500 text-white'
										: 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
								}`}
							>
								{interest}
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</form>
</div>
