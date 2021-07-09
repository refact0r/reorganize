<script>
	import Profile from "./Profile.svelte";
	import Home from "./Home.svelte";
	import Calendar from "./Calendar.svelte";
	import Tasks from "./Tasks.svelte";
	import Events from "./Events.svelte";
	import Reminders from "./Reminders.svelte";
	import Lists from "./Lists.svelte";
	import { tick } from 'svelte'
	import firebase from 'firebase/app';
    import { db } from './firebase';
	import { auth, googleProvider } from './firebase';
	import { fly } from 'svelte/transition';

	// initialize variables
	let user;
	let child;
	let selected = Home;
	let selectedListIndex = 0;
	let lists = [];
	$: selectedList = lists[selectedListIndex];

	// create listener for list changes
	function loadLists() {
		db.collection("lists")
			.where("uid", "==", user.uid)
			.orderBy("created")
			.onSnapshot((snapshot) => {
				lists = snapshot.docs.map((doc, index) => {
					let item;
					if (index < lists.length && doc.id == lists[index].id) {
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
									lists[index].tasks = snapshot.docs.map((doc) => ({
										id: doc.id,
										...doc.data(),
									}));
									if (index === selectedListIndex) {
										selectedList = lists[selectedListIndex];
									}
									console.log("Tasks updated: ", lists[index].id, lists[index].tasks);
								})
						}
					}
					return item;
				});
				updateIndicatorStyle();
				console.log("Lists updated: ", lists);
			});
	}

	// create a new list
	function createList() {
		db.collection("lists")
			.add({
				uid: user.uid,
				name: "new list",
				created: firebase.firestore.FieldValue.serverTimestamp()
			}).then((docRef) => {
				selectList(lists.length - 1);
				tick().then(() => child.clearListName());
				console.log("List added with id: ", docRef.id);
			});
	}

	// delete a list
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
	
	// select a list
	function selectList(index) {
		selected = Lists;
		selectedListIndex = index;
	}

	// check for auth changes
	auth.onAuthStateChanged((authUser) => {
		console.log('auth state changed');
		if (authUser) {
			user = authUser;
			db.collection('users')
				.doc(user.uid)
				.get()
				.then((docSnapshot) => {
					if (!docSnapshot.exists) {
						console.log(user.uid);
						db.collection('users')
							.doc(user.uid)
							.set({
								name: user.displayName,
								created: firebase.firestore.FieldValue.serverTimestamp(),
							});
					}
				});
			loadLists();
		}
	});

	// log in
	function login() {
        auth.signInWithPopup(googleProvider);
    }

	// log out
	function logout() {
		auth.signOut();
	}

	// initialize style vars
	let css = "";
	let n = 10;
	let distance = 22;
	let style = document.createElement("style");
	document.head.appendChild(style);

	// update indicator style
	function updateIndicatorStyle() {
		css = "";
		n = 10;
		distance = 22;
		for (let i = 0; i < lists.length; i++) {
			css += `.sidebar-button:nth-child(${n}).selected ~ #indicator { transform: translateY(${distance}rem); }`;
			n++;
			distance += 3;
		}
		style.innerHTML = '';
		style.appendChild(document.createTextNode(css));
	}
</script>

<style>
	main {
		display: grid;
		grid-template-columns: auto 1fr auto;
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
		grid-column: 1;
		display: flex;
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
	
	.selected {
		font-weight: 500;
	}
	
	.selected .bi {
		color: var(--font-color) !important;
	}
	
	.bi {
		color: var(--sub-color);
		transition: 0.2s ease-out;
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
	
	.sidebar-button:nth-child(4).selected ~ #indicator {
		transform: translateY(5rem);
	}
	
	.sidebar-button:nth-child(5).selected ~ #indicator {
		transform: translateY(8rem);
	}

	.sidebar-button:nth-child(6).selected ~ #indicator {
		transform: translateY(11rem);
	}

	.sidebar-button:nth-child(7).selected ~ #indicator {
		transform: translateY(14rem);
	}

	.sidebar-button:nth-child(8).selected ~ #indicator {
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
		grid-column: 2;
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
		<div id="sidebar" class="glass-bg">
			<div id="sidebar-inner-scroll">
				<div id="sidebar-inner">
					<h2 id="sidebar-title">reorganize</h2>

					<button class="sidebar-button {selected === Profile ? "selected" : ""}" on:click={() => selected = Profile}>
						<div class="sidebar-icon-container"><i class="bi bi-person"></i></div>
						{user.displayName}
					</button>

					<hr>

					<button class="sidebar-button {selected === Home ? "selected" : ""}" on:click={() => selected = Home}>
						<div class="sidebar-icon-container"><i class="bi bi-house"></i></div>
						home
					</button>
					<button class="sidebar-button {selected === Calendar ? "selected" : ""}" on:click={() => selected = Calendar}>
						<div class="sidebar-icon-container"><i class="bi bi-calendar4-week"></i></div>
						calendar
					</button>
					<button class="sidebar-button {selected === Tasks ? "selected" : ""}" on:click={() => selected = Tasks}> 
						<div class="sidebar-icon-container"><i class="bi bi-check2-circle"></i></div>
						tasks
					</button>
					<button class="sidebar-button {selected === Events ? "selected" : ""}" on:click={() => selected = Events}>
						<div class="sidebar-icon-container"><i class="bi bi-calendar4-event"></i></div>
						events
					</button>
					<button class="sidebar-button {selected === Reminders ? "selected" : ""}" on:click={() => selected = Reminders}>
						<div class="sidebar-icon-container"><i class="bi bi-bell"></i></div>
						reminders
					</button>

					<hr>
					{#each lists as list, index}
						<button class="sidebar-button {selected === Lists && selectedListIndex === index ? "selected" : ""}" on:click={() => selectList(index)}>
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
			listIndex={selectedListIndex}
			username={user.displayName}
			userId={user.uid}
			on:deleteList={(event) => deleteList(event.detail.index)}
			bind:this={child}/>
	{:else}
		<div id="login-container" class="glass-bg">
			<h2 id="login-title">welcome to reorganize!</h2>
			<button on:click={login} id="login-button" class="button inside text">
				<div class="login-icon-container"><i class="bi bi-google"></i></div>
				<div class="login-button-text">sign in with google</div>
			</button>
		</div>
	{/if}
</main>
