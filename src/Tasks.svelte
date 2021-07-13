<script>
	import { fade } from 'svelte/transition';
	import firebase from 'firebase/app';
    import { db } from './firebase';
    import { createTask, deleteTask } from './tasks';

    // get props
    export let tasks;

    export let userId;
    
    // initialize variables
    let newTaskName = "";
    let inputTaskName = false;
    let selectedTaskIndex;
    let prevSelectedTaskId;

    $: selectedTask = tasks[selectedTaskIndex];

    // set selectedTaskIndex to null if a task was deleted
    $: if (selectedTaskIndex != null) {
        if (selectedTaskIndex >= tasks.length || tasks[selectedTaskIndex].id != prevSelectedTaskId) {
            selectedTaskIndex = null;
        }
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
        if (selectedTask != null && selectedTask.id === tasks[index].id) {
            selectedTaskIndex = null;
        } else {
            selectedTaskIndex = index;
            prevSelectedTaskId = tasks[selectedTaskIndex].id;
        }
    }

    // rename a task
    function renameTask(name, id) {
        if (name) {
            db.collection("tasks")
                .doc(id)
                .update({
                    name: name
                }).then(() => {
                    console.log("Task renamed with id: ", id);
                });
        } else {
            inputTaskName = false;
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
            createTask(userId, "", newTaskName);
            newTaskName = "";
        }
    }

    // focus element
    function focus(element) {
        element.focus();
    }
</script>

<svelte:head>
    <title>reorganize: tasks</title>
</svelte:head>

<style>    
    #page {
        display: flex;
        flex-direction: column;
    }

    #page-inner {
        height: 100%;
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

    #details-task-input {
        width: 100%;
    }

    #details-task-input:focus {
        border-bottom: 2px solid var(--sub-color);
    }

    #details-task-name {
        word-break: break-all;
    }
</style>

<div id="page">
    <div id="page-inner">
        <div id="title-bar">
            <h2 id="page-title">tasks</h2>
        </div>

        {#each tasks as task, index}
            {#if !task.completed}
                <div class="task glass-bg {selectedTaskIndex === index ? "selected" : ""}" on:click|self={() => selectTask(index)}>
                    <button class="button inside icon task-complete" on:click={() => completeTask(task)}></button>
                    <div class="task-text" on:click={() => selectTask(index)} >{task.name}</div>
                    <button class="button inside icon task-delete" on:click={() => deleteTask(task.id)}><i class="bi bi-x"></i></button>   
                </div>
            {/if}
        {/each}

        {#if tasks.find(task => task.completed)}
            <h3>completed</h3>
        {/if}

        {#each tasks as task, index}
            {#if task.completed}
                <div class="task glass-bg completed {selectedTaskIndex === index ? "selected" : ""}" on:click|self={() => selectTask(index)}>
                    <button class="button inside icon task-complete" on:click={() => completeTask(task)}></button>
                    <div class="task-text" on:click={() => selectTask(index)}>{task.name}</div>
                    <button class="button inside icon task-delete" on:click={() => deleteTask(task.id)}><i class="bi bi-x"></i></button>   
                </div>
            {/if}
        {/each}
    </div>

    <div id="new-task-container" class="glass-bg">
        <button id="new-task-button" class="button inside icon" on:click={() => createTask(userId, "", newTaskName), newTaskName = ""}><i class="bi bi-plus"></i></button>            
        <input id="new-task-input"
            bind:value={newTaskName}
            placeholder="Enter task name..."
            on:keydown={event => createOnEnter(event)}>
    </div>
</div>

<div id="details-sidebar" class="{selectedTask != null ? "expanded" : ""} glass-bg">
    {#if selectedTask != null}
        <div id="details-sidebar-inner" in:fade="{{delay: 0, duration: 200}}" out:fade="{{delay: 0, duration: 100}}">
            <div id="details-task">
                <button class="button inside icon task-complete" on:click={() => completeTask(selectedTask)}></button>
                {#if inputTaskName}
                    <input
                        id="details-task-input"
                        value={selectedTask.name}
                        placeholder="Enter task name..."
                        on:change={event => renameTask(event.target.value, selectedTask.id)} 
                        on:keydown={event => blurOnEnter(event)}
                        on:focusout={() => inputTaskName = false}
                        use:focus>
                {:else}
                    <div id="details-task-name" on:click={() => inputTaskName = true}>{selectedTask.name}</div>
                {/if}
            </div>
        </div>
    {/if}
</div>