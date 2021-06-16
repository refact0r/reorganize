<script>
    export let list;
</script>

<svelte:head>
    <title>reorganize: {list.name}</title>
</svelte:head>

<style>
    #page {
        padding: 2rem 3rem;
        height: 100vh;
        z-index: 5;
    }

    #page-title {
        margin: 0;
    }

    #header-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 0 2rem 0;
    }
</style>

<div id="page">
    <div id="header-bar">
        <h2 id="page-title">{list.name}</h2>
        <button class="icon-button"><i class="bi bi-three-dots-vertical"></i></button>
    </div>
    {list.created}
    <!-- {#each list.items as item}
        <div class="task"><button class="complete"></button>{item}</div>
    {/each} -->
</div>
