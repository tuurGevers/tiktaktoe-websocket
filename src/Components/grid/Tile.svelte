<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    let filled = false;
    export let index;
    import{player1, tiles, socket} from "../../stores";

    let value = ""

    function onClick(){
        if(!filled){
            $player1?value="X":value="O"
            $tiles[index] = $player1?1:0
            dispatch('changePlayer', {
                text: $player1
            });
        }


    }
    $socket.on("cast click", (body)=>{
        if(body.tile===index){
            console.log(body)
            $tiles = body.tiles
            $player1 = body.player
            value= body.player?"X":"O";
            console.log($tiles)
        }


    })


</script>

<style>
    div{
        border: 3px solid black;
        width: 5vw;
        min-height: 5vw;
        background-color: #ebeee8;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
    }
</style>

<div on:click={()=>  onClick()}>
    {value}
</div>
