<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import type { Activity } from '$lib/schemas/itinerary'; // Adjust import path as needed

	interface Props {
		activity: Activity;
	}

	let { activity }: Props = $props();

	function formatTime(time: string): string {
		return time.replace(/(\d{1,2}):(\d{2})\s*(AM|PM)/i, '$1:$2 $3');
	}
</script>

<Card class="border-zinc-700 bg-zinc-900">
	<CardContent class="p-3">
		<div class="mb-2 flex items-start justify-between">
			<div class="flex items-center gap-2">
				<Badge variant="secondary" class="bg-blue-900/30 text-blue-400 hover:bg-blue-900/40">
					{formatTime(activity.time)}
				</Badge>
				<span class="text-sm text-gray-400">({activity.duration})</span>
			</div>
			{#if activity.cost}
				<Badge variant="outline" class="border-green-400/30 text-green-400">
					{activity.cost}
				</Badge>
			{/if}
		</div>

		<h6 class="mb-2 font-medium text-white">{activity.title}</h6>
		<p class="mb-2 text-sm text-gray-400">{activity.description}</p>

		{#if activity.tips}
			<div class="rounded border border-yellow-700/30 bg-yellow-900/20 p-2 text-xs text-yellow-400">
				💡 {activity.tips}
			</div>
		{/if}
	</CardContent>
</Card>
