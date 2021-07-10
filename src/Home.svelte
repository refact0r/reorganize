<script>
	import { onMount } from 'svelte';

    export let username;

    const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

    let d = new Date();

    $: rawHours = d.getHours();
    $: rawMinutes = d.getMinutes();
    $: hours = rawHours % 12 ? rawHours % 12 : 12;
    $: minutes = rawMinutes < 10 ? '0' + rawMinutes : rawMinutes;
    $: ampm = rawHours >= 12 ? 'pm' : 'am';
    $: day = weekdays[d.getDay()];
    $: month = months[d.getMonth()];
    $: date = d.getDate();

    onMount(() => {
		const interval = setInterval(() => {
			d = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<svelte:head>
    <title>reorganize</title>
</svelte:head>

<style>
    #page-title {
        margin: 0 0 2rem 0;
    }
</style>

<div id="page">
    <h1 id="page-title">welcome, {username}!</h1>

    <h2>{hours}:{minutes} {ampm}</h2>

    <h2>today is {day}, {month} {date}.</h2>
</div>
