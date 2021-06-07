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

    let prev = generateCalendar(new Date(year, month - 1));
	let current = generateCalendar(new Date(year, month));
	let next = generateCalendar(new Date(year, month + 1));
    
    console.log(prev);
    console.log(current);
    console.log(next);
    
</script>

<svelte:head>
    <title>reorganize: calendar</title>
</svelte:head>

<style>
    #container {
        padding: 2rem 3rem;
    }
    
    #page-title {
        margin: 0 0 2rem 0;
    }

    #calendar {
        display: grid;
        grid-template-rows: auto repeat(6, 1fr);
        height: 100vh;
    }

    .calendar-header, .calendar-week {
        display: grid;
        background: var(--glass-bg-color);
        backdrop-filter: blur(30px);
        margin: 0.3rem 0;
        border: var(--glass-border);
        border-radius: 0.6rem;
        box-shadow: var(--box-shadow);
        align-items: center;
    }

    .calendar-header {
        grid-template-columns: repeat(7, 1fr);
        justify-content: center;
        text-align: center;
        padding: 0.5rem;
        height: min-content;
    }

    .calendar-week {
        grid-template-columns: 1fr repeat(6, auto 1fr);
    }

    .calendar-day, .calendar-header-day {
        font-size: 1.3em;
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

<div id="container">
    <h2 id="page-title">calendar</h2>
    <!-- <div id="calendar">
        <div class="calendar-header">
            <div>mon</div>
            <div>tue</div>
            <div>wed</div>
            <div>thu</div>
            <div>fri</div>
            <div>sat</div>
            <div>sun</div>
        </div>
        <div class="calendar-week">
            <div class="calendar-day">1</div>
            <div class="calendar-day">2</div>
            <div class="calendar-day">3</div>
            <div class="calendar-day">4</div>
            <div class="calendar-day">5</div>
            <div class="calendar-day">6</div>
            <div class="calendar-day">7</div>
        </div>
        <div class="calendar-week">
            <div class="calendar-day">8</div>
            <div class="calendar-day">9</div>
            <div class="calendar-day">10</div>
            <div class="calendar-day">11</div>
            <div class="calendar-day">12</div>
            <div class="calendar-day">13</div>
            <div class="calendar-day">14</div>        
        </div>
        <div class="calendar-week">
            <div class="calendar-day">15</div>
            <div class="calendar-day">16</div>
            <div class="calendar-day">17</div>
            <div class="calendar-day">18</div>
            <div class="calendar-day">19</div>
            <div class="calendar-day">20</div>
            <div class="calendar-day">21</div>    
        </div>
        <div class="calendar-week">
            <div class="calendar-day">22</div>
            <div class="calendar-day">23</div>
            <div class="calendar-day">24</div>
            <div class="calendar-day">25</div>
            <div class="calendar-day">26</div> 
            <div class="calendar-day">27</div> 
            <div class="calendar-day">28</div> 
        </div>
        <div class="calendar-week">
            <div class="calendar-day">29</div>
            <div class="calendar-day">30</div>
            <div class="calendar-day">31</div>
            <div class="calendar-day">1</div>
            <div class="calendar-day">2</div>
            <div class="calendar-day">3</div>
            <div class="calendar-day">4</div>
        </div>
    </div> -->
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