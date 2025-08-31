<!-- Single Trip Page -->
<!-- List Page of trips -->
<script>
	import '../../../app.css';
	import { onMount } from 'svelte';
	let trips = $state([
		{
			id: 1,
			name: 'Beach Getaway',
			destination: 'Bali',
			startDate: '2023-06-15',
			endDate: '2023-06-30'
		}
	]);

	// onMount(async () => {
	// 	const response = await fetch('/trips');
	// 	trips = await response.json();
	// 	console.log('response:', response);
	// });
</script>

<header class="container mx-auto flex items-center justify-between p-4">
	<div class="flex items-center space-x-2">
		<span class="font-serif text-xl">Embark</span>
	</div>
</header>
<main class="container mx-auto px-6 py-8">
	<h1 class="mb-4 font-serif text-4xl">Your Trips</h1>
	<ul>
		{#each trips as trip}
			<li class="max-w-lg rounded-xl border p-4 shadow-sm">
				<a href={`/trips/${trip.id}`}>
					<h2>{trip.name}</h2>
				</a>
			</li>
		{/each}
	</ul>
</main>
