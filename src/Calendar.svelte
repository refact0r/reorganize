<script>
    let offset = 1;
    // let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    // let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    // let monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let monthsShort = ["jan", "feb", "mar", "apr", "may", "jun", "july", "aug", "sep", "oct", "nov", "dec"];

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

	let mode = "month";

	function switchMode(str) {
		if (str === "week") {
			if (month === date.getMonth() && year === date.getFullYear()) {
				week = Math.floor((date.getDate() + new Date(year, month, 1 - offset).getDay() - 1) / 7);
			} else {
				week = 0;
			}
		}
		mode = str;
	}

	let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
	let week = Math.floor((date.getDate() + new Date(year, month, 1 - offset).getDay() - 1) / 7);

    $: prev = generateCalendar(new Date(year, month - 1)); 
    $: current = generateCalendar(new Date(year, month));
    $: next = generateCalendar(new Date(year, month + 1));
	$: title = generateTitle(mode, year, month, week);
    
    function nextView() {
		if (mode === "week") {
			if (week >= current.length - 2 && current[week].includes(0) || week === current.length - 1) {
				week = 0;
				nextMonthView();
			} else {
				week += 1;
			}
		} else {
			nextMonthView();
		}
    }

	function nextMonthView() {
		if (month === 11) {
			month = 0;
			year += 1;
		} else {
			month += 1;
		}
	}

    function prevView() {
        if (mode === "week") {
			if (week === 0) {
				if (prev[prev.length - 1].includes(0)) {
					week = prev.length - 2;
				} else {
					week = prev.length - 1;
				}
				prevMonthView();
			} else {
				week -= 1;
			}
		} else {
			prevMonthView();
		}
    }

	function prevMonthView() {
		if (month === 0) {
			month = 11;
			year -= 1;
		} else {
			month -= 1;
		}
	}

	function today() {
		year = date.getFullYear();
		month = date.getMonth();
		week = Math.floor((date.getDate() + new Date(year, month, 1 - offset).getDay() - 1) / 7);
	}
	
	function generateTitle(mode, year, month, week) {
		if (mode === "week") {
			if (week === 0 && current[week].includes(0)) {
				if (month === 0) {
					return `${months[11]} ${year - 1} - ${months[0]} ${year}`;
				} else {
					return `${months[month - 1]} - ${months[month]} ${year}`;
				}
			} else if (week === current.length - 2 && current[week].includes(0)) {
				if (month === 11) {
					return `${months[11]} ${year} - ${months[0]} ${year + 1}`;
				} else {
					return `${months[month]} - ${months[month + 1]} ${year}`;
				}
			} else {
				return `${months[month]} ${year}`;
			}
		} else {
			return `${months[month]} ${year}`;
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

    #title-bar {
        display: grid;
		grid-template-columns: 1fr auto 1fr;
        margin-bottom: 1rem;
    }	

	.slider-container {
		display: flex;
		font-size: 1.1em;
		border-radius: 0.6rem;
		position: relative;
	}

	.slider {
		margin-right: 0.4rem;
	}

	.slider.active {
		font-weight: 500;
	}
	
	.slider-indicator {
		content: "";
		display: block;
		position: absolute;
		background: var(--font-color);
		left: 0.4rem;
		bottom: 0rem;
		width: 4.2rem;
		height: 2px;
		border-radius: 0.6rem;
		transition: 0.2s ease-out;
		z-index: -1;
	}

	.slider:nth-child(2).active ~ .slider-indicator {
		transform: translate(5.4rem);
	}

	.slider:nth-child(3).active ~ .slider-indicator {
		transform: translateX(10rem);
	}

	#calendar-title {
		margin: auto;
	}

	.title-bar-inner {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.bi-chevron-left {
		margin-right: 0.2rem;
	}
	
	.bi-chevron-right {
		margin-left: 0.2rem;
	}

    #calendar {
        display: grid;
		grid-template-rows: auto 1fr;
        height: 100%;
	    gap: 0.3rem;
    }

	.calendar-body {
		display: grid;
	    gap: 0.3rem;
	}

	.calendar-body.month {
        grid-template-rows: repeat(6, 1fr);
	}

	.calendar-body.week {
        grid-template-columns: repeat(7, 1fr);
	}

    .calendar-header {
        display: grid;
        align-items: center;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: auto auto;
        justify-content: center;
        text-align: center;
        padding: 0.3rem;
        height: min-content;
    }

	.calendar-header, .calendar-day {
		background: var(--glass-bg-color);
        backdrop-filter: var(--blur);
        border: var(--glass-border);
        border-radius: 0.6rem;
        box-shadow: var(--box-shadow);
	}

	.calendar-week {
		display: grid;
        grid-template-columns: repeat(7, 1fr);
		column-gap: 0.3rem;
    }

    .calendar-day, .calendar-header-day {
        font-size: 1.1em;
    }

    .calendar-day {
        height: 100%;
        padding: 0.3rem;
    }

	.calendar-day-text {
		width: 2rem;
		height: 2rem;
		line-height: 2rem;
		text-align: center;
		border-radius: 2rem;
	}

    .other {
        color: hsla(0, 0%, 100%, 0.3);
    }

	.calendar-day.today .calendar-day-text {
        background: hsla(0, 0%, 100%, 0.2);
		font-weight: 500;
	}
</style>

<div id="page">
    <div id="title-bar">
		<div class="slider-container">
			<button class="outside-button text slider {mode === "week" ? "active" : ""}" on:click={() => switchMode("week")}>week</button>
			<button class="outside-button text slider {mode === "month" ? "active" : ""}" on:click={() => switchMode("month")}>month</button>
			<div class="slider-indicator"></div>
		</div>

        <h2 id="calendar-title">{title}</h2>

		<div class="title-bar-inner">
			<button class="outside-button text" on:click={() => today()}>today</button>
			<button class="outside-button icon" on:click={() => prevView()}><i class="bi bi-chevron-left"></i></button>
			<button class="outside-button icon" on:click={() => nextView()}><i class="bi bi-chevron-right"></i></button>
		</div>
    </div>

    <div id="calendar">
		<div class="calendar-header">
            {#each weekdays as _, wd}
                <div class="calendar-header-day">{weekdays[(wd + offset) % 7]}</div>
            {/each}
        </div>

		{#if mode === "month"}
			<div class="calendar-body month">
				{#each {length : 6} as _, w}
					<div class="calendar-week">
						{#each {length: 7} as _, d}
							{#if current[w]}
								{#if current[w][d] === date.getDate() && month === date.getMonth() && year === date.getFullYear()}
									<div class="calendar-day today">
										<div class="calendar-day-text">{current[w][d]}</div>
									</div>

								{:else if current[w][d] !== 0}
									<div class="calendar-day">
										<div class="calendar-day-text">{current[w][d]}</div>
									</div>

								{:else if w < 1}
									<div class="calendar-day other">
										<div class="calendar-day-text">{prev[prev.length - 1][d]}</div>
									</div>

								{:else}
									<div class="calendar-day other">
										<div class="calendar-day-text">{next[0][d]}</div>
									</div>
								{/if}
							{:else}
								<div class="calendar-day other">
									<div class="calendar-day-text">{next[1][d]}</div>
								</div>
							{/if}
						{/each}
					</div>
				{/each}
			</div>
		{:else if mode === "week"}
			<div class="calendar-body week">
				{#each {length: 7} as _, d}
					{#if current[week][d] === date.getDate() && month === date.getMonth()}
						<div class="calendar-day today">
							<div class="calendar-day-text">{current[week][d]}</div>
						</div>

					{:else if current[week][d] !== 0}
						<div class="calendar-day">
							<div class="calendar-day-text">{current[week][d]}</div>
						</div>

					{:else if week < 1}
						<div class="calendar-day">
							<div class="calendar-day-text">{prev[prev.length - 1][d]}</div>
						</div>

					{:else}
						<div class="calendar-day">
							<div class="calendar-day-text">{next[0][d]}</div>
						</div>
					{/if}
				{/each}
			</div>
		{/if}
    </div>
</div>
