<script>
	import { fade } from 'svelte/transition';
	import firebase from 'firebase/app';
    import { db } from './firebase';
    import { createTask } from './tasks';

    // get props
    export let tasks;

    export let userId;
    
    // initialize variables
    let taskName = "";
    let selectedTask;
    let selectedTaskId;
    let inputTaskName = false;

    $: if (selectedTask != null) {
        if (selectedTask >= tasks.length || tasks[selectedTask].id != selectedTaskId) {
            selectedTask = null;
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
        if (selectedTask != null && tasks[selectedTask].id === tasks[index].id) {
            selectedTask = null;
        } else {
            selectedTask = index;
            selectedTaskId = tasks[selectedTask].id;
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
            createTask(userId, taskName);
            taskName = "";
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

    #page-title {
        margin: 0 2rem 0 0;
        height: 3rem;
        text-align: center;
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
                <div class="task glass-bg {selectedTask === index ? "selected" : ""}" on:click|self={() => selectTask(index)}>
                    <button class="button inside icon task-complete" on:click={() => completeTask(task)}></button>
                    <div class="task-text" on:click={() => selectTask(index)} >{task.name}</div>
                    <button class="button inside icon task-delete" on:click={() => deleteTask(task)}><i class="bi bi-x"></i></button>   
                </div>
            {/if}
        {/each}

        {#if tasks.find(task => task.completed)}
            <h3>completed</h3>
        {/if}

        {#each tasks as task, index}
            {#if task.completed}
                <div class="task glass-bg completed {selectedTask === index ? "selected" : ""}" on:click|self={() => selectTask(index)}>
                    <button class="button inside icon task-complete" on:click={() => completeTask(task)}></button>
                    <div class="task-text" on:click={() => selectTask(index)}>{task.name}</div>
                    <button class="button inside icon task-delete" on:click={() => deleteTask(task)}><i class="bi bi-x"></i></button>   
                </div>
            {/if}
        {/each}
    </div>

    <div id="new-task-container" class="glass-bg">
        <button id="new-task-button" class="button inside icon" on:click={() => createTask(userId, taskName), taskName = ""}><i class="bi bi-plus"></i></button>            
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
                <button class="button inside icon task-complete" on:click={() => completeTask(tasks[selectedTask])}></button>
                {#if inputTaskName}
                    <input
                        id="details-task-input"
                        value={tasks[selectedTask].name}
                        placeholder="Enter task name..."
                        on:change={event => renameTask(event.target.value, tasks[selectedTask].id)} 
                        on:keydown={event => blurOnEnter(event)}
                        on:focusout={() => inputTaskName = false}
                        use:focus>
                {:else}
                    <div id="details-task-name" on:click={() => inputTaskName = true}>{tasks[selectedTask].name}</div>
                {/if}
            </div>
        </div>
    {/if}
</div>