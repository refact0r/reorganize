<script>
	import Profile from "./Profile.svelte";
	import Home from "./Home.svelte";
	import Calendar from "./Calendar.svelte";
	import Tasks from "./Tasks.svelte";
	import Events from "./Events.svelte";
	import Reminders from "./Reminders.svelte";
	import Lists from "./Lists.svelte";

	let selected = Home;
	let selectedList = 0;

	let lists = [
		{
			name: "list 1",
			items: [
				"this is a list"
			]
		},
		{
			name: "list 2",
			items: [
				"this is a list"
			]
		},
		{
			name: "list 3",
			items: [
				"this is a list"
			]
		}
	];

	//initialize style vars
	let css = "";
	let child = 10;
	let translate = 22;
	let style = document.createElement('style');
	document.head.appendChild(style);

	//add initial indicator styles
	for (let i = 0; i < lists.length; i++) {
		css += `.sidebar-button:nth-child(${child}).active ~ #indicator { transform: translateY(${translate}rem); }`;
		child++;
		translate += 3;
	}
	style.appendChild(document.createTextNode(css));

	//updates indicator style so that it can move to any new lists
	function updateIndicatorStyle() {
		css = `.sidebar-button:nth-child(${child}).active ~ #indicator { transform: translateY(${translate}rem); }`;
		child++;
		translate += 3;
		style.appendChild(document.createTextNode(css));
	}
	
	//creates a new list
	function createList() {
		lists.push({ name: "list " + (lists.length + 1), items: [ "this is a list" ]});
		updateIndicatorStyle();	
		selectList(lists.length - 1);
	}
	
	//selects a list
	function selectList(index) {
		selected = Lists;
		selectedList = index;
	}
</script>

<style>
	main {
		display: grid;
		grid-template-columns: 16rem auto;
		height: 100vh;
		overflow: hidden;
		background: var(--background);
		background-position: center;
		background-size: cover;
		color: var(--font-color);
		font-family: Poppins;
		font-weight: 300;
	}
	
	main:before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		backdrop-filter: var(--background-filter);
		z-index: 1;
	}
	
	#sidebar {
		display: flex;
		flex-direction: column;
		height: 100vh;
		backdrop-filter: blur(30px);
		background: var(--glass-bg-color);
		border-right: var(--glass-border);
		box-shadow: var(--box-shadow);
		font-size: 1.1em;
		z-index: 10;
	}

	#sidebar-inner {
		overflow-y: hidden;
		display: flex; 
		flex-direction: column-reverse;
		scrollbar-width: thin;
		scrollbar-color: hsla(0, 0%, 100%, 0.2) transparent;
	}

	#sidebar-inner:hover {
		overflow-y: auto;
	}

	#sidebar-inner2 {
		position: relative;
	}
	
	.sidebar-button {
		display: flex;
		padding: 0rem 2rem;
		width: 100%;
		height: 3rem;
		align-items: center;
		transition: 0.1s ease-out;
	}
	
	.sidebar-button:hover {
		background: hsla(0, 0%, 100%, 0.1);
	}

	.sidebar-button:active {
		transform: scale(0.95);
	}
	
	.active {
		font-weight: 500;
	}

	#indicator {
		content: "";
		display: block;
		position: absolute;
		background: var(--font-color);
		top: 6.2rem;
		left: 1.2rem;
		width: 2px;
		height: 1.6rem;
		margin-bottom: 0rem;
		border-radius: 1rem;
		transition: 0.2s ease-out;
	}
	
	.sidebar-button:nth-child(4).active ~ #indicator {
		transform: translateY(5rem);
	}
	
	.sidebar-button:nth-child(5).active ~ #indicator {
		transform: translateY(8rem);
	}

	.sidebar-button:nth-child(6).active ~ #indicator {
		transform: translateY(11rem);
	}

	.sidebar-button:nth-child(7).active ~ #indicator {
		transform: translateY(14rem);
	}

	.sidebar-button:nth-child(8).active ~ #indicator {
		transform: translateY(17rem);
	}
	
	.active .bi {
		color: var(--font-color) !important;
	}

	.sidebar-icon-container {
		width: 1.4rem;
		margin-right: 1rem;
	}
	
	.bi {
		font-size: 1.2em;
		color: var(--sub-color);
		transition: 0.4s ease-out;
	}

	.bi-check2-circle {
		font-size: 1.4em;
		margin-left: -0.15rem;
	}

	.bi-plus {
		font-size: 1.6em;
		margin-left: -0.25rem;
	}
	
	#new-list-button {
		display: flex;
		justify-self: flex-end;
		align-items: center;
		margin: auto 0 1rem 0;
		background: none;
		text-align: left;
		padding: 0rem 2rem;
		height: 3rem;
		width: 100%;
		flex-shrink: 0;
	}
	
	#new-list-button:hover {
		background: hsla(0, 0%, 100%, 0.1);
	}
	
	#title {
		font-size: 1.5em;
		padding: 2rem 2rem 1rem 2rem;
		margin: 0;
	}

	hr {
		width: 100%;
		height: 2rem;
		margin: 0;
		border: none;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	hr::after {
		content: "";
		display: block;
		width: 80%;
		border-radius: 1rem;
		height: 2px;
		background: var(--sub-color);
	}
</style>

<main>
	<div id="sidebar">
		<div id="sidebar-inner">
			<div id="sidebar-inner2">
			<h1 id="title">reorganize</h1>

			<button class="sidebar-button {selected === Profile ? 'active' : ''}" on:click={() => (selected = Profile)}>
				<div class="sidebar-icon-container"><i class="bi bi-person"></i></div>
				username
			</button>

			<hr>

			<button class="sidebar-button {selected === Home ? 'active' : ''}" on:click={() => (selected = Home)}>
				<div class="sidebar-icon-container"><i class="bi bi-house"></i></div>
				home
			</button>
			<button class="sidebar-button {selected === Calendar ? 'active' : ''}" on:click={() => (selected = Calendar)}>
				<div class="sidebar-icon-container"><i class="bi bi-calendar4-week"></i></div>
				calendar
			</button>
			<button class="sidebar-button {selected === Tasks ? 'active' : ''}" on:click={() => (selected = Tasks)}> 
				<div class="sidebar-icon-container"><i class="bi bi-check2-circle"></i></div>
				tasks
			</button>
			<button class="sidebar-button {selected === Events ? 'active' : ''}" on:click={() => (selected = Events)}>
				<div class="sidebar-icon-container"><i class="bi bi-calendar4-event"></i></div>
				events
			</button>
			<button class="sidebar-button {selected === Reminders ? 'active' : ''}" on:click={() => (selected = Reminders)}>
				<div class="sidebar-icon-container"><i class="bi bi-bell"></i></div>
				reminders
			</button>

			<hr>	

			{#each lists as list, index}
				<button class="sidebar-button {selected === Lists && selectedList === index ? 'active' : ''}" on:click={() => selectList(index)}>
					<div class="sidebar-icon-container"><i class="bi bi-list"></i></div>
					{list.name}
				</button>
			{/each}
			<div id="indicator"></div>
			</div>
		</div>

		<button id="new-list-button" on:click={() => createList()}>
			<div class="sidebar-icon-container"><i class="bi bi-plus"></i></div>
			new list
		</button>
	</div>
	
	<svelte:component this={selected} list={lists[selectedList]}/>
</main>
