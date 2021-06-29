<script>
    import { createEventDispatcher } from 'svelte';
    import { db } from './firebase';

    // event dispatcher
    const dispatch = createEventDispatcher();

    // get list and index
    export let selectedIndex;
    export let list;
    
    // set name and previous name
    let name = list.name;
    let prevName = name;

    // only change name when list.name is different
    $: if (list.name != prevName) {
        name = list.name;
        prevName = name;
    }

    // focus on page title and clears name
    export function clearName() {
        document.getElementById("page-title").focus();
        name = "";
    }

    // send event dispatch to delete current list
    function deleteList() {
        dispatch('deleteList', {
            index: selectedIndex
        });
    }

    // rename current list
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

    // blur if enter was pressed
    function blurOnEnter(event) {
        if (event.keyCode === 13) {
            event.target.blur();
        }
    }
</script>

<svelte:head>
    {#if list}
        <title>reorganize: {list.name}</title>
    {/if}
</svelte:head>

<style>
    #page {
        display: flex;
        flex-direction: column;
    }

    #page-inner {
        height: 100%;
    }

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

    #new-task-container {
        display: flex;
        align-items: center;
        flex-shrink: 0;
	    height: 3rem;
    }

    #new-task-button {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 0.6rem 0 0.3rem;
    }

    #new-task-button .bi {
        /* line-height: 3rem; */
        color: var(--sub-color);
    }

    /* .bi-plus {
        font-size: 2.2em;
    } */

    #new-task-input {
        background: none;
        outline: none;
        border: none;
        /* border-bottom: 2px solid var(--sub-color); */
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        color: inherit;
        width: 100%;
    }
</style>

{#if list}
    <div id="page">
        <div id="page-inner">
            <div id="title-bar">
                <input id="page-title"
                    value={name}
                    placeholder="Enter list name..."
                    on:change={event => renameList(event)} 
                    on:keydown={event => blurOnEnter(event)}>
                <button class="button outside icon" on:click={() => deleteList()}><i class="bi bi-trash"></i></button>
            </div>
            {#each list.tasks as task}
                <div class="task glass-bg"><button class="task-complete-button"></button>{task.name}</div>
            {/each}
        </div>
        <div id="new-task-container" class="glass-bg">
            <button id="new-task-button" class="button inside icon"><i class="bi bi-plus"></i></button>            
            <input id="new-task-input"
                value=""
                placeholder="Enter task name...">
        </div>
    </div>
{/if}
