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

	let view = "month";

	let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();

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

    #calendar {
        display: grid;
        grid-template-rows: auto repeat(6, 1fr);
        height: 100%;
	    row-gap: 0.4rem;
    }

    .calendar-header, .calendar-week {
        display: grid;
        background: var(--glass-bg-color);
        backdrop-filter: var(--blur);
        border: var(--glass-border);
        border-radius: 0.6rem;
        box-shadow: var(--box-shadow);
        align-items: center;
    }

    .calendar-title-container {
        display: flex;
		align-items: center;
        margin-bottom: 1rem;
    }

    .calendar-title {
        margin: auto;
    }
    
    .calendar-button-container {
        width: 10rem;
        text-align: right;
    }

	.calendar-button {
		border-radius: 1rem;
		width: 2rem;
		height: 2rem;
		text-align: center;
		padding: 0;
		transition: transform 0.05s ease-out;
	}

	.calendar-button:hover {
		background: hsla(0, 0%, 100%, 0.1);
	}

	.calendar-button:active {
		transform: scale(0.95);
	}

	.bi {
		font-size: 1.2em;
	}

	.bi-chevron-left {
		margin-right: 0.2rem;
	}
	
	.bi-chevron-right {
		margin-left: 0.2rem;
	}

	.calendar-slider {
		display: flex;
		font-size: 1.1em;
		background: var(--glass-bg-color);
		backdrop-filter: var(--blur);
		border-radius: 0.6rem;
		padding: 0.3rem 0;
	}

	.calendar-slider-button {
		width: 5rem;
	}

    .calendar-header {
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: auto auto;
        justify-content: center;
        text-align: center;
        padding: 0.3rem;
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
        padding: 0.5rem 1rem;
    }

    .other {
        color:hsla(0, 0%, 100%, 0.3)
    }

    .vl-container {
        width: 2px;
        height: 100%;
        padding: 0.8rem 0;
    }

    .vl {
        width: 2px;
        background: hsla(0, 0%, 100%, 0.1);
        height: 100%;
        
    }

	#indicator {
		content: "";
		display: block;
		position: absolute;
		background: var(--glass-bg-color);
		top: 5%;
		left: .1rem;
		width: 4.8rem;
		height: 90%;
		border-radius: 0.5rem;
		transition: 0.2s ease-out;
	}

	.calendar-slider-button:nth-child(2).active ~ #indicator {
		transform: translateX(5rem);
	}

	.calendar-slider-button:nth-child(3).active ~ #indicator {
		transform: translateX(10.6rem);
	}
</style>

<div id="page">
    <div class="calendar-title-container">
		<div class="calendar-slider">
			<button class="calendar-slider-button {view === "week" ? 'active' : ''}" on:click={() => (view = "week")}>week</button>
			<button class="calendar-slider-button {view === "month" ? 'active' : ''}" on:click={() => (view = "month")}>month</button>
			<div id="indicator"></div>
		</div>
        <h2 class="calendar-title">{months[month]} {year}</h2>
        <div class="calendar-button-container">
            <button class="calendar-button" on:click={() => prevMonth()}><i class="bi bi-chevron-left"></i></button>
            <button class="calendar-button" on:click={() => nextMonth()}><i class="bi bi-chevron-right"></i></button>
        </div>
    </div>

    <div id="calendar">
        <div class="calendar-header">
            {#each labels as label, l}
                <div class="calendar-header-day">{labels[(l + offset) % 7]}</div>
            {/each}
        </div>
        {#each {length : 6} as _, w}
            <div class="calendar-week">
                {#each {length: 7} as _, d}
                    {#if d !== 0}
                        <div class="vl-container">
                            <div class="vl"></div>
                        </div>
                    {/if}
                    {#if current[w]}
                        {#if current[w][d] !== 0}
                            <div class="calendar-day">{current[w][d]}</div>
                        {:else if w < 1}
                            <div class="calendar-day other">{prev[prev.length - 1][d]}</div>
                        {:else}
                            <div class="calendar-day other">{next[0][d]}</div>
                        {/if}
                    {:else}
                        <div class="calendar-day other">{next[1][d]}</div>
                    {/if}
                {/each}
            </div>
        {/each}
    </div>
</div>
