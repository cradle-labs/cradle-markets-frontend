"use client"

import { createContext, RefObject, useContext, useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"

interface GossipListenerContext {
    addListener: (key: string, listener: (data: any)=>void) => void
    removeListener: (key: string) => void
    listeners: RefObject<Map<string, (data: any)=>void>>
}

const context = createContext<GossipListenerContext | null>(null)

export const GossipContextProvider = (props: {children: React.ReactNode}) => {
    const { children } = props
    const socketRef = useRef<Socket | null>(null)
    const listenersRef = useRef<Map<string, (data: any)=>void>>(new Map())
    
    const addListener = (key: string, listener: (data: any)=>void) => {
        listenersRef.current.set(key, listener)
        if (socketRef.current) {
            socketRef.current.on(key, (data: any) => {
                listener(data)
            })
        }
    }

    const removeListener = (key: string) => {
        listenersRef.current.delete(key)
        if (socketRef.current) {
            socketRef.current.off(key)
        }
    }


    useEffect(()=>{
        
        if(!socketRef.current){
            const socket = io(process.env.NEXT_PUBLIC_API ?? 'http://localhost:8080', {
                extraHeaders: {
                    'channel': 'listener'
                }
            })
            socketRef.current = socket
        }

        if(socketRef.current){
            console.log("Socket is connected")
            if (!socketRef.current.connected) {
                socketRef.current.connect()
            }
            socketRef.current.on('connect', ()=>{
                console.log("Connected to Gossip")
            })

            socketRef.current.on('disconnect', ()=>{
                console.log("Disconnected from Gossip")
            })


            
        }


        return ()=>{
            if(socketRef.current){
                socketRef.current.disconnect()
                console.log("Disconnected from Gossip")
            }
        }
    }, [])

    return (
        <context.Provider value={{ addListener, listeners: listenersRef, removeListener }} >
            {children}
        </context.Provider>
    )

}

export const useGossipListener = () => {
    const contextValue = useContext(context)
    return contextValue
}

export default function GossipListener() {
    return (
        <div className="hidden" />
    )
}