import {readable, writable} from "svelte/store";
import io from 'socket.io-client'

//export const socket =readable(io("ws://localhost:3001"))

export const socket =readable(io("ws://198.177.124.166:3001"))
export let player1 = writable(true)
export let tiles = writable([])
