<script lang="ts">
	import '../../../app.css';
	let { children } = $props();
</script>

<main class="min-h-screen bg-zinc-900 text-white">
	<div class="container mx-auto">
		<header class="flex items-center justify-between p-4">
			<div class="flex items-center space-x-2">
				<span class="text-xl font-bold">chapp</span>
			</div>
		</header>
		<div class="content p-4">
			{@render children()}
		</div>
	</div>
</main>
