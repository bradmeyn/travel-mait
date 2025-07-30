<script lang="ts">
	import PromptInput from './_components/prompt-input.svelte';
	import ChatWindow from './_components/chat-window.svelte';
	import { setChatState } from './chat-state.svelte';

	let prompt = $state('');
	let isSubmitting = $state(false);

	let chat = setChatState();

	async function onsubmit() {
		if (!prompt.trim()) return;

		isSubmitting = true;
	}
</script>

<div class="mx-auto mt-12 max-w-3xl">
	<div class="mb-8">
		<h1 class="mb-4 text-4xl font-bold">
			Where would you like to go?<span class="text-orange-500">_</span>
		</h1>
	</div>

	<ChatWindow messages={chat.messages} {isSubmitting} />
	<PromptInput {prompt} {onsubmit} />
</div>
