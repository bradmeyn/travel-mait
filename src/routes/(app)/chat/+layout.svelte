<script lang="ts">
	import '../../../app.css';
	let { children } = $props();
</script>

<main class="min-h-screen bg-zinc-900 text-white">
	<div class=" mx-auto px-2">
		<header class="mx-auto mb-8 flex items-center justify-between border-b border-zinc-700 p-4">
			<div class="flex items-center justify-between">
				<h1 class="spacing text-2xl text-white">
					Travel M<span class="text-sky-300">ai</span>t
				</h1>
			</div>
		</header>
		<div>
			{@render children()}
		</div>
	</div>
</main>
