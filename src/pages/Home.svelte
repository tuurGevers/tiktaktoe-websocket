<script>
    import Tile from "../Components/grid/Tile.svelte";
    import {player1, tiles, socket} from "../stores";

    import {onMount} from "svelte";


    onMount(() => {
        $socket.connect()

    })
    let winner = [false, ""]



    function createRoom() {
        $socket.emit("create room", {
            code: "test game",
            player: "host"
        })
    }

    function joinRoom() {
        $socket.emit("join room", {
            code: "test game",
            player: "player2"

        })
    }

    $socket.once("game over", (data)=>
        alert("the winner is: " + data?"0":"X")
    )

</script>

<style>
    .row {
        display: flex;

    }
</style>

<div>
    {#each Array(3) as _, i }
        <div class="row">
            {#each Array(3) as _, x}
                <Tile index={i*3+x} on:changePlayer={()=>{
                    $socket.emit("click", {
                        tile: i*3+x,
                        player: $player1,
                        room:"test game"
                        } )
            }}/>
            {/each}
        </div>
    {/each}
</div>

<button on:click={()=> createRoom()}>
    create room
</button>
<button on:click={()=> joinRoom()}>
    join room
</button>

{#if winner[0] === true}
    <h1>winner is {winner[1]}</h1>
{/if}

