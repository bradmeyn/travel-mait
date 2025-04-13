<script lang="ts">
	import { goto } from '$app/navigation';
	import PromptInput from './_components/PromptInput.svelte';

	let prompt = $state('');
	let isSubmitting = $state(false);

	async function onsubmit() {
		if (!prompt.trim()) return;

		isSubmitting = true;

		try {
			// This would be your actual API call
			// const response = await fetch('/api/chat', {
			//   method: 'POST',
			//   body: JSON.stringify({ prompt }),
			//   headers: { 'Content-Type': 'application/json' }
			// });
			// const data = await response.json();

			// For now, just simulate with a timeout
			await new Promise((resolve) => setTimeout(resolve, 800));

			// Navigate to a new chat with a generated ID
			const chatId = `chat_${Date.now()}`;
			goto(`/chat/${chatId}?initial=${encodeURIComponent(prompt)}`);
		} catch (error) {
			console.error('Error starting chat:', error);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="mx-auto mt-12 max-w-3xl">
	<div class="mb-8">
		<h1 class="mb-4 text-4xl font-bold">Enter prompt<span class="text-gray-500">_</span></h1>
	</div>

	<PromptInput {prompt} {onsubmit} />
</div>
