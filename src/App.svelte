<script>
	import Profile from "./Profile.svelte";
	import Home from "./Home.svelte";
	import Calendar from "./Calendar.svelte";
	import Tasks from "./Tasks.svelte";
	import Events from "./Events.svelte";
	import Reminders from "./Reminders.svelte";
	import Lists from "./Lists.svelte";
	import { onMount } from 'svelte';
	import { tick } from 'svelte'
	import firebase from 'firebase/app';
    import { db } from './firebase';
	import { auth, googleProvider } from './firebase';
	import { fly } from 'svelte/transition';

	let username = "refact0r";
	let uid = "TGSdllf5Kac83Y1EC5y1";
	let user;
	// user = "hi";
	let child;
	let selected = Home;
	let selectedIndex = 0;
	let lists = [];
	$: selectedList = lists[selectedIndex];

	//listen for list changes
	db.collection("lists")
		.where("uid", "==", uid)
		.orderBy("created")
		.onSnapshot((snapshot) => {
			lists = snapshot.docs.map((doc, index) => {
				let item;
				if (index < lists.length) {
					item = {
						id: doc.id,
						...doc.data(),
						tasks: lists[index].tasks,
						unsubscribe: lists[index].unsubscribe
					}
				} else {
					item = {
						id: doc.id,
						...doc.data(),
						tasks: [],
						unsubscribe: db.collection("tasks")
							.where("list_id", "==", doc.id)
							.orderBy("created")
							.onSnapshot((snapshot) => {
								item.tasks = snapshot.docs.map((doc) => ({
									id: doc.id,
									...doc.data(),
								}));
								if (index === selectedIndex) {
									selectedList = lists[selectedIndex];
								}
							})
					}
				}
				return item;
			});
			updateIndicatorStyle();
			console.log("Lists updated: ", lists);
		});

	//creates a new list
	function createList() {
		db.collection("lists")
			.add({
				name: "new list",
				created: firebase.firestore.FieldValue.serverTimestamp(),
				uid: uid
			}).then((docRef) => {
				selectList(lists.length - 1);
				tick().then(() => child.focusInput());
				console.log("List added with id: ", docRef.id);
			});
	}

	//deletes a list
	function deleteList(index) {
		let id = lists[index].id;
		if (index > 0) {
			selectList(index - 1);
		} else {
			selected = Home;
		}
		lists[index].unsubscribe();
        db.collection("lists")
			.doc(id)
			.delete()
			.then((docRef) => {
				console.log("List deleted with id: ", id);
			});
    }
	
	//selects a list
	function selectList(index) {
		selected = Lists;
		selectedIndex = index;
	}

	//check for auth changes
	auth.onAuthStateChanged((authUser) => {
		console.log('auth state changed');
		if (authUser) {
			db.collection('users')
				.doc(authUser.uid)
				.get()
				.then((docSnapshot) => {
					if (!docSnapshot.exists) {
						console.log(authUser.uid);
						db.collection('users')
							.doc(authUser.uid)
							.set({
								created: firebase.firestore.FieldValue.serverTimestamp(),
							});
					}
				});
			user = authUser;
		}
	});

	//login
	function login() {
        auth.signInWithPopup(googleProvider);
    }

	//logout
	function logout() {
		auth.signOut();
	}

	//initialize style vars
	let css = "";
	let n = 10;
	let distance = 22;
	let style = document.createElement("style");
	document.head.appendChild(style);

	//updates indicator style
	function updateIndicatorStyle() {
		css = "";
		n = 10;
		distance = 22;
		for (let i = 0; i < lists.length; i++) {
			css += `.sidebar-button:nth-child(${n}).active ~ #indicator { transform: translateY(${distance}rem); }`;
			n++;
			distance += 3;
		}
		style.innerHTML = '';
		style.appendChild(document.createTextNode(css));
	}
</script>

<style>
	main {
		display: flex;
		height: 100vh;
		overflow: hidden;
		background: var(--bg-picture);
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
		backdrop-filter: var(--bg-filter);
		z-index: 1;
	}
	
	#sidebar {
		display: flex;
		flex-shrink: 0;
		flex-direction: column;
		height: 100vh;
		z-index: 10;
		width: 16rem;
		border-radius: 0;
	}

	#sidebar-inner-scroll {
		overflow-y: auto;
		display: flex;
		flex-direction: column-reverse;
		height: 100%;
		scrollbar-width: none;
		scrollbar-color: hsla(0, 0%, 100%, 0.2) transparent;
	}

	#sidebar-inner-scroll:hover {
		scrollbar-width: thin;
	}

	#sidebar-inner {
		margin-bottom: auto; 
		position: relative;
	}
	
	.sidebar-button {
		display: flex;
		padding: 0rem 2rem;
		width: 100%;
		height: 3rem;
		align-items: center;
		transition: 0.05s ease-out;
	}
	
	.sidebar-button:hover {
		background: hsla(0, 0%, 100%, 0.1);
	}

	.sidebar-button:active {
		transform: scale(0.95);
	}
	
	.sidebar-button-text {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.sidebar-icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		flex-shrink: 0;
		margin-right: 1rem;
	}
	
	.active {
		font-weight: 500;
	}
	
	.active .bi {
		color: var(--font-color) !important;
	}
	
	.bi {
		color: var(--sub-color);
		transition: 0.2s ease-out;
	}

	.bi-check2-circle {
		font-size: 1.4em;
	}

	.bi-plus {
		font-size: 1.6em;
	}

	#indicator {
		content: "";
		display: block;
		position: absolute;
		background: var(--font-color);
		top: 6rem;
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
	
	#new-list-button {
		margin: auto 0 1rem 0;
		flex-shrink: 0;
		justify-self: flex-end;
	}
	
	#sidebar-title {
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

	#login-container {
		width: auto;
		height: auto;
		margin: auto;
		padding: 2rem;
		z-index: 5;
		text-align: center;
	}

	#login-button {
		padding: 0.4rem 0.6rem;
		width: 100%;
	}

	#login-title {
		margin: 0 0 2rem 0;
	}

	.login-icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		flex-shrink: 0;
	}

	.login-button-text {
		margin: 0 auto;
	}
</style>

<main>
	{#if user}
		<div id="sidebar" class="glass-bg" transition:fly="{{ x: -200, duration: 1000 }}">
			<div id="sidebar-inner-scroll">
				<div id="sidebar-inner">
					<h2 id="sidebar-title">reorganize</h2>

					<button class="sidebar-button {selected === Profile ? "active" : ""}" on:click={() => selected = Profile}>
						<div class="sidebar-icon-container"><i class="bi bi-person"></i></div>
						{user.displayName}
					</button>

					<hr>

					<button class="sidebar-button {selected === Home ? "active" : ""}" on:click={() => selected = Home}>
						<div class="sidebar-icon-container"><i class="bi bi-house"></i></div>
						home
					</button>
					<button class="sidebar-button {selected === Calendar ? "active" : ""}" on:click={() => selected = Calendar}>
						<div class="sidebar-icon-container"><i class="bi bi-calendar4-week"></i></div>
						calendar
					</button>
					<button class="sidebar-button {selected === Tasks ? "active" : ""}" on:click={() => selected = Tasks}> 
						<div class="sidebar-icon-container"><i class="bi bi-check2-circle"></i></div>
						tasks
					</button>
					<button class="sidebar-button {selected === Events ? "active" : ""}" on:click={() => selected = Events}>
						<div class="sidebar-icon-container"><i class="bi bi-calendar4-event"></i></div>
						events
					</button>
					<button class="sidebar-button {selected === Reminders ? "active" : ""}" on:click={() => selected = Reminders}>
						<div class="sidebar-icon-container"><i class="bi bi-bell"></i></div>
						reminders
					</button>

					<hr>
					{#each lists as list, index}
						<button class="sidebar-button {selected === Lists && selectedIndex === index ? "active" : ""}" on:click={() => selectList(index)}>
							<div class="sidebar-icon-container"><i class="bi bi-list"></i></div>
							<div class="sidebar-button-text">{list.name}</div>
						</button>
					{/each}
					<div id="indicator"></div>
				</div>
			</div>

			<button id="new-list-button" class="sidebar-button" on:click={() => createList()}>
				<div class="sidebar-icon-container"><i class="bi bi-plus"></i></div>
				<div class="sidebar-button-text">new list</div>
			</button>
		</div>
		
		<svelte:component 
			this={selected}
			list={selectedList}
			selectedIndex={selectedIndex}
			username={user.displayName}	
			on:deleteList={(event) => deleteList(event.detail.index)}
			bind:this={child}/>
	{:else}
		<div id="login-container" class="glass-bg">
			<h2 id="login-title">welcome to reorganize!</h2>
			<button on:click={login} id="login-button" class="button inside">
				<div class="login-icon-container"><i class="bi bi-google"></i></div>
				<div class="login-button-text">sign in with google</div>
			</button>
		</div>
	{/if}
</main>
