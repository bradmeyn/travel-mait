<script lang="ts">
	import '../../app.css';
	let { children } = $props();
</script>

<main class="min-h-screen">
	<div class="container mx-auto">
		<header class="flex items-center justify-between p-4">
			<div class="flex items-center space-x-2">
				<span class="font-serif text-xl">Embark</span>
			</div>
			<nav class="flex items-center space-x-6">
				<a href="/auth/login" class="rounded px-3 py-1 text-sm">Log In</a>
				<a href="/auth/signup" class="rounded px-3 py-1 text-sm">Sign Up</a>
			</nav>
		</header>
		<div class="content p-4">
			{@render children()}
		</div>
	</div>
</main>
