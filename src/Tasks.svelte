<script>
</script>

<svelte:head>
    <title>reorganize: tasks</title>
</svelte:head>

<style>
    #page {
        padding: 2rem 3rem;
	    height: 100vh;
	    z-index: 5;
    }
    
    #page-title {
        margin: 0 0 2rem 0;
    }
    
    .task {
        display: flex;
        padding: 0.7rem 1rem;
        backdrop-filter: var(--blur);
        background: var(--glass-bg-color);
        border: var(--glass-border);
        border-radius: 0.6rem;
        margin-bottom: 0.4rem;
        align-items: center;
        box-shadow: var(--box-shadow);
    }
    
    .complete {
        background: none;
        margin: 0 1rem 0 0;
        padding: 0;
        width: 1.4rem;
        height: 1.4rem;
        border-radius: 2rem;
        border: 2px solid var(--sub-color);
    }
</style>

<div id="page">
    <h2 id="page-title">tasks</h2>
    <div class="task"><button class="complete"></button>some task</div>
    <div class="task"><button class="complete"></button>some task</div>
    <div class="task"><button class="complete"></button>some task</div>
    <div class="task"><button class="complete"></button>some task</div>
    <div class="task"><button class="complete"></button>some task</div>
</div>
