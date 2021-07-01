<script>
    import { createEventDispatcher } from 'svelte';
	import firebase from 'firebase/app';
    import { db } from './firebase';

    // event dispatcher
    const dispatch = createEventDispatcher();

    // get props
    export let selectedIndex;
    export let list;
    export let userId;
    
    // initialize variables
    let listName = list.name;
    let prevName = listName;
    let taskName = "";

    // only change name when list.name is different
    $: if (list.name != prevName) {
        listName = list.name;
        prevName = listName;
    }

    // focus on page title and clears name
    export function clearListName() {
        document.getElementById("page-title").focus();
        listName = "";
    }

    // send event dispatch to delete current list
    function deleteList() {
        dispatch('deleteList', {
            index: selectedIndex
        });
    }

    // rename current list
    function renameList(event) {
        if (event.target.value) {
            db.collection("lists")
                .doc(list.id)
                .update({
                    name: event.target.value
                }).then(() => {
                    console.log("List renamed with id: ", list.id);
                });
        } else {
            document.getElementById("page-title").value = list.name;
        }
    }

    // create a task
    function createTask() {
        if (taskName) {
            db.collection("tasks")
                .add({
                    uid: userId,
                    list_id: list.id,
                    name: taskName,
                    completed: false,
                    created: firebase.firestore.FieldValue.serverTimestamp()
                }).then((docRef) => {
                    console.log("Task created with id: ", docRef.id);
                });
            taskName = "";
        }
    }

    // delete a task
    function deleteTask(id) {
        db.collection("tasks")
            .doc(id)
            .delete()
            .then(() => {
                console.log("Task deleted with id: ", id);
            });
    }

    // complete a task
    function completeTask(id, completed) {
        console.log(completed);
        db.collection("tasks")
            .doc(id)
            .update({
                completed: !completed
            }).then(() => {
                console.log("Task completed with id: ", id);
            });
    }

    // blur if enter was pressed
    function blurOnEnter(event) {
        if (event.keyCode === 13) {
            event.target.blur();
        }
    }

    // create task if enter was pressed
    function createOnEnter(event) {
        if (event.keyCode === 13) {
            createTask();
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
        margin: 0 0.4rem 0 0.6rem;
    }

    /* .bi-plus {
        font-size: 2.2em;
    } */

    #new-task-input {
        width: 100%;
    }
</style>

{#if list}
    <div id="page">
        <div id="page-inner">
            <div id="title-bar">
                <input id="page-title"
                    value={listName}
                    placeholder="Enter list name..."
                    on:change={event => renameList(event)} 
                    on:keydown={event => blurOnEnter(event)}>
                <button class="button outside icon" on:click={() => deleteList()}><i class="bi bi-trash"></i></button>
            </div>

            {#each list.tasks as task}
                {#if !task.completed}
                    <div class="task glass-bg">
                        <button class="button inside icon task-complete" on:click={() => completeTask(task.id, task.completed)}></button>
                        <div class="task-text">{task.name}</div>
                        <button class="button inside icon task-delete" on:click={() => deleteTask(task.id)}><i class="bi bi-x"></i></button>   
                    </div>
                {/if}
            {/each}

            {#if list.tasks.find(task => task.completed)}
                <h3>completed</h3>
            {/if}

            {#each list.tasks as task}
                {#if task.completed}
                    <div class="task glass-bg completed">
                        <button class="button inside icon task-complete" on:click={() => completeTask(task.id, task.completed)}></button>
                        <div class="task-text">{task.name}</div>
                        <button class="button inside icon task-delete" on:click={() => deleteTask(task.id)}><i class="bi bi-x"></i></button>   
                    </div>
                {/if}
            {/each}
        </div>

        <div id="new-task-container" class="glass-bg">
            <button id="new-task-button" class="button inside icon" on:click={() => createTask()}><i class="bi bi-plus"></i></button>            
            <input id="new-task-input"
                bind:value={taskName}
                placeholder="Enter task name..."
                on:keydown={event => createOnEnter(event)}>
        </div>
    </div>
{/if}
