<script>

    let offset = 1;
    let labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let months_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    function generateCalendar(date) {
        var year = date.getFullYear();
        var month = date.getMonth();
        var first = new Date(year, month, 1 - offset).getDay();
        var days = new Date(year, month + 1, 0).getDate();

        let out = [];
        let week = [];
        let i = 1;

        while (i <= days) {
            week = Array(7);
            for (let j = 0; j < 7; j++){
                if (j < first) {
                    week[j] = 0;
                } else {
                    if (i <= days) {
                        week[j] = i;
                    } else {
                        week[j] = 0;
                    }
                    i++;
                }
            }
            first = 0;
            out.push(week);
        }
        return out;
    }

    let year = 2021;
    let month = 5;

    $: prev = generateCalendar(new Date(year, month - 1));
    $: current = generateCalendar(new Date(year, month));
    $: next = generateCalendar(new Date(year, month + 1));
    
    function nextMonth() {
        month += 1;
        if (month >= 12) {
            year += 1;
            month = 0;
        }
    }

    function prevMonth() {
        month -= 1;
        if (month < 0) {
            year -= 1;
            month = 11;
        }
    }
	
</script>

<svelte:head>
    <title>reorganize: calendar</title>
</svelte:head>

<style>
    #page {
        padding: 2rem 3rem 3rem 3rem;
        height: 100vh;
        z-index: 5;
        display: flex;
        flex-direction: column;
    }
    
    #page-title {
        margin: 0;
    }

    #calendar {
        display: grid;
        grid-template-rows: auto repeat(6, 1fr);
        height: 100%;
    }

    .calendar-header, .calendar-week {
        display: grid;
        background: var(--glass-bg-color);
        backdrop-filter: var(--blur);
        margin: 0.3rem 0;
        border: var(--glass-border);
        border-radius: 0.6rem;
        box-shadow: var(--box-shadow);
        align-items: center;
    }

    .calendar-title-container {
        display: flex;
        margin: 0.5rem 0;
    }

    .calendar-title {
        margin: auto;
        font-size: 1.7em;
    }

    .calendar-header {
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: auto auto;
        justify-content: center;
        text-align: center;
        padding: 0.5rem;
        height: min-content;
    }

    .calendar-week {
        grid-template-columns: 1fr repeat(6, auto 1fr);
    }

    .calendar-day, .calendar-header-day {
        font-size: 1.1em;
    }

    .calendar-day {
        height: 100%;
        padding: 1rem;
    }

    .other {
        color:hsla(0, 0%, 100%, 0.3)
    }

    .vl {
        width: 2px;
        background: hsla(0, 0%, 100%, 0.1);
        height: 70%;
    }
</style>

<div id="page">
    <h2 id="page-title">calendar</h2>

    <div class="calendar-title-container">
        <h2 class="calendar-title">{months[month]} {year}</h2>
        <button on:click={() => prevMonth()}><i class="bi bi-chevron-left"></i></button>
        <button on:click={() => nextMonth()}><i class="bi bi-chevron-right"></i></button>
    </div>

    <div id="calendar">
        <div class="calendar-header">
            {#each labels as label, l}
                <div class="calendar-header-day">{labels[(l + offset) % 7]}</div>
            {/each}
        </div>
        {#each current as week, w}
            <div class="calendar-week">
                {#each week as day, d}
                    {#if d !== 0}
                        <div class="vl"></div>
                    {/if}
                    {#if day !== 0}
                        <div class="calendar-day">{day}</div>
                    {:else if w < 1}
                        <div class="calendar-day other">{prev[prev.length - 1][d]}</div>
                    {:else}
                        <div class="calendar-day other">{next[0][d]}</div>
                    {/if}
                {/each}
            </div>
        {/each}
    </div>
</div>
