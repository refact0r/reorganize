<script>
    import { createEventDispatcher } from 'svelte';
    import { db } from './firebase';

    const dispatch = createEventDispatcher();

    // export let lists;
    export let selectedIndex;
    export let list;

    function deleteList() {
        dispatch('deleteList', {
            index: selectedIndex
        });
    }

    function renameList(event) {
        if (!event.target.value) {
            document.getElementById("page-title").value = list.name;
        } else {
            db.collection("lists")
			.doc(list.id)
			.update({
				name: event.target.value
			});
        }
    }

    function deselectOnEnter(event) {
        if (event.keyCode === 13) {
            event.target.blur();
        }
    }
    
    let name = list.name;
    let prevName = name;

    $: if (list.name != prevName) {
        name = list.name;
        prevName = name;
    }

    export function focusInput() {
        document.getElementById("page-title").focus();
        name = "";
        console.log("name set");
    }
</script>

<svelte:head>
    {#if list}
        <title>reorganize: {list.name}</title>
    {/if}
</svelte:head>

<style>
    #page-title {
        margin: 0 2rem 0 0;
        width: 100%;
        height: 3rem;
        font-weight: 700;
        font-size: 1.5em;
        font-family: inherit;
        color: inherit;
        background: none;
        border: none;
        outline: none !important;
    }

    #page-title:focus {
        border-top: 2px solid transparent;
        border-bottom: 2px solid var(--sub-color);
    }

    #title-bar {
        display: flex;
        align-items: center;
        margin: 0 0 2rem 0;
    }

    .outside-button {
        margin: 0 0 0 0.4rem;
    }
</style>

{#if list}
    <div id="page">
        <div id="title-bar">
            <input id="page-title"
                value={name}
                placeholder="Enter list name..."
                on:change={event => renameList(event)} 
                on:keydown={event => deselectOnEnter(event)}>
            <button class="outside-button icon" on:click={() => deleteList()}><i class="bi bi-trash"></i></button>
        </div>
        {#each list.tasks as task}
            <div class="task glass-bg"><button class="task-complete-button"></button>{task.name}</div>
        {/each}
    </div>
{/if}
