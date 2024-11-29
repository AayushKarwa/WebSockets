
import { useEffect, useRef, useState } from 'react'
import './App.css'


function App() {
  const [messages, setMessages] = useState(['hi there','heloo'])
  const wsReff = useRef();
  const inputReff = useRef()
  useEffect(()=>{
    const ws = new WebSocket('ws://localhost:8080')

    ws.onmessage = (event)=>{
      setMessages(m=> [...m , event.data])
    }
    wsReff.current = ws;
   ws.onopen = ()=>{
    ws.send(JSON.stringify({
      
        type:'join',
        payload: {
          roomid: 'red'
        }
      
    }))
   }
   return () =>{
    ws.close()
  }
  }
 
  ,[])

  return (
 
    <div className='h-screen bg-black '>
      <br /><br /><br />
        <div className='h-[75vh]'>
          {messages.map(mes => <div className='m-8'><span className='bg-white text-black rounded p-4'>{mes}</span></div>)}
        </div>
        <div className='w-full bg-white flex'>
          <input ref={inputReff} id='text' className='flex-1 p-4 bg-white' type="text" placeholder='prompt' />
          <button  onClick={()=>{
            const message = inputReff.current?.value;
            wsReff.current.send(JSON.stringify({
              type:'chat',
              payload: {
                message:message,
                roomid: 'red'
              }
            }))

          }} className='bg-purple-500 text-white p-3'>Submit</button>
        </div>
   </div>
  )
}

export default App
