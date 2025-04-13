<script lang="ts">
	let { prompt = $bindable(''), onsubmit } = $props();
	let isSubmitting = $state(false);
	let textareaRef: HTMLTextAreaElement;

	// Auto-resize textarea as content grows
	function autoResize() {
		if (textareaRef) {
			textareaRef.style.height = 'auto';
			textareaRef.style.height = `${Math.min(200, textareaRef.scrollHeight)}px`;
		}
	}

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (prompt.trim() && onsubmit) {
			isSubmitting = true;
			onsubmit(prompt);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit(event);
		}
	}
</script>

<div class="mx-auto max-w-3xl">
	<form onsubmit={handleSubmit} class="relative">
		<div
			class="relative overflow-hidden rounded-lg border border-gray-700 bg-[#1E2031] transition-all focus-within:border-transparent focus-within:ring-2 focus-within:ring-indigo-500"
		>
			<div class="flex flex-col">
				<textarea
					bind:value={prompt}
					bind:this={textareaRef}
					oninput={autoResize}
					onkeydown={handleKeyDown}
					placeholder="Ask me anything..."
					class="max-h-[200px] min-h-[56px] w-full resize-none overflow-y-auto bg-transparent px-4 py-3 text-white focus:outline-none"
					rows="1"
				></textarea>

				<div class="flex justify-end px-4 pb-3">
					<button
						type="submit"
						class="flex items-center justify-center rounded bg-indigo-500 p-2 px-4 text-white transition-colors hover:bg-indigo-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						disabled={isSubmitting || !prompt.trim()}
						title="Submit"
					>
						Send
						{#if isSubmitting}
							<svg
								class="h-5 w-5 animate-spin"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</form>
</div>
