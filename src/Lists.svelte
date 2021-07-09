<script>
    import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import firebase from 'firebase/app';
    import { db } from './firebase';

    // event dispatcher
    const dispatch = createEventDispatcher();

    // get props
    export let list;
    export let listIndex;
    export let userId;
    
    // initialize variables
    let listName = list.name;
    let prevTaskName = listName;
    let taskName = "";
    let selectedTask;
    let selectedTaskId;

    // only change name when list.name is different
    $: if (list.name != prevTaskName) {
        listName = list.name;
        prevTaskName = listName;
    }

    $: if (selectedTask != null) {
        if (selectedTask >= list.tasks.length || list.tasks[selectedTask].id != selectedTaskId) {
            selectedTask = null;
        }
    }

    // focus on page title and clears name
    export function clearListName() {
        document.getElementById("page-title").focus();
        listName = "";
    }

    // send event dispatch to delete current list
    function deleteList() {
        dispatch('deleteList', {
            index: listIndex
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
    function deleteTask(task) {
        db.collection("tasks")
            .doc(task.id)
            .delete()
            .then(() => {
                console.log("Task deleted with id: ", task.id);
            });
    }

    // complete a task
    function completeTask(task) {
        console.log(!task.completed);
        db.collection("tasks")
            .doc(task.id)
            .update({
                completed: !task.completed
            }).then(() => {
                console.log("Task completed with id: ", task.id);
            });
    }

    // select a task
    function selectTask(index) {
        console.log("selected: ", index);
        if (selectedTask != null && list.tasks[selectedTask].id === list.tasks[index].id) {
            selectedTask = null;
        } else {
            selectedTask = index;
            selectedTaskId = list.tasks[selectedTask].id;
        }
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

    #new-task-input {
        width: 100%;
    }

    #details-task {
        display: flex;
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

            {#each list.tasks as task, index}
                {#if !task.completed}
                    <div class="task glass-bg {selectedTask === index ? "selected" : ""}" on:click|self={() => selectTask(index)}>
                        <button class="button inside icon task-complete" on:click={() => completeTask(task)}></button>
                        <div class="task-text">{task.name}</div>
                        <button class="button inside icon task-delete" on:click={() => deleteTask(task)}><i class="bi bi-x"></i></button>   
                    </div>
                {/if}
            {/each}

            {#if list.tasks.find(task => task.completed)}
                <h3>completed</h3>
            {/if}

            {#each list.tasks as task, index}
                {#if task.completed}
                    <div class="task glass-bg completed {selectedTask === index ? "selected" : ""}" on:click|self={() => selectTask(index)}>
                        <button class="button inside icon task-complete" on:click={() => completeTask(task)}></button>
                        <div class="task-text">{task.name}</div>
                        <button class="button inside icon task-delete" on:click={() => deleteTask(task)}><i class="bi bi-x"></i></button>   
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

    <div id="details-sidebar" class="{selectedTask != null ? "expanded" : ""} glass-bg">
        {#if selectedTask != null}
            <div id="details-sidebar-inner" in:fade="{{delay: 0, duration: 200}}" out:fade="{{delay: 0, duration: 100}}">
                <div id="details-task">
                    <button class="button inside icon task-complete" on:click={() => completeTask(list.tasks[selectedTask])}></button>
                    <div>{list.tasks[selectedTask].name}</div>
                </div>
            </div>
        {/if}
    </div>
{/if}
