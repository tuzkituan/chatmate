import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useId, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import socket from '../utils/socket'
import { useRouter } from 'next/router'

const Home: NextPage = (props: any) => {
  const router = useRouter()
  const { username = '' } = router.query

  const [value, setValue] = useState('')
  const [messages, setMessages] = useState<Object[]>([])
  const [activeUsers, setActiveUsers] = useState<Object[]>([])
  const [receiver, setReceiver] = useState('')
  const messRef = useRef<any>(null)

  useEffect(() => {
    if (!username) {
      router.push('/')
    }
    socket.on('sendDataServer', (payload: any) => {
      setMessages(messages => [...messages, payload.data])
      setTimeout(() => {
        messRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100);
    })
    socket.on('sendActiveUser', (payload: any) => {
      setActiveUsers(payload.filter((x: any) => x !== username))
    })
    socket.on('getMessages', (payload: any) => {
      setMessages(payload)
  })
    return () => {
      socket.off('sendDataServer');
      socket.off('sendActiveUser');
    };
  }, [])
  
  useEffect(() => {
    if (!activeUsers.includes(receiver)) {
      setReceiver('')
    }
  }, [JSON.stringify(activeUsers)])
  

  const logout = () => {
    router.push('/');
    socket.emit('logout', username)
  }

  const _renderActiveUser = () => {
    return (
      <div className={styles.activeUsers}>
        {activeUsers.map((x: any) =>
        <div  onClick={() => {
          setReceiver(x);
          socket.emit('refresh', x)
        }} style={{
          cursor: 'pointer',
          backgroundColor: x === receiver ? 'orange' : '#fff',
          borderRadius: '30px',
          padding: '4px 8px',
          marginInline: 4,
          width:'fit-content',
          display:'flex',
          alignItems:'center',
          gap: 5
        }}>
          <img src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png" alt='' style={{  width: '16px',
          height: '16px',
        }} />
        <span style={{
         display:'block',
          color: x === receiver ? '#fff' : '#000',
         
          fontWeight: 700,
          fontSize: 12,
        }}>
        
        
         {x}
         
         </span>
        
        
        </div>)}
      </div>
    )
  }

  const _renderMessages = () => {
    return <div className={styles.messages} style={{
      maxHeight: '50vh',
      overflow: 'auto'
    }}>
      {messages.filter((x: any) => (x.receiver === username && x.id === receiver) || (x.id === username && x.receiver === receiver)).map((x: any) => <span style={{
        display: 'block',
        padding: 8,
        borderRadius: 5,
        backgroundColor: x.id === username ? 'gray' : '#669999',
        color: x.id === username ? 'white' : 'black',
        marginBlock: 8,
        width: 'fit-content',
        fontSize: 12,
        textAlign: x.id === username ? 'right' : 'left'
      }}>
        {x.value}
      </span>)}
      <div ref={messRef}></div>
    </div>
  }

  const onSendMessage = (val: any) => {
    if (val) {
      socket.emit('sendDataClient', {
        id: username,
        value: val,
        receiver
      })
      setValue('')
    }
  }

  const onKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      onSendMessage(value)
    }
  }

  const _renderInput = () => {
    return <div style={{
      marginTop: 20
    }}>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKeyDown} />
      <button type="button" onClick={() => {
        if (value) {
          onSendMessage(value)
        }
      }
      }>SEND</button>
    </div>

  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Chat/chit</title>
        <meta name="description" content="Chat & chit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {_renderActiveUser()}
        <p className={styles.description}>
          <code className={styles.code}>chat/chit</code>
        </p>

        {receiver ?
          <div className={styles.chatContainer}>
            {_renderMessages()}
            {_renderInput()}
          </div> : <div
            style={{
              fontSize: 12,
              fontStyle: 'italic',
            }}>
            <div>Select an user</div>
          </div>}
        <span onClick={logout} style={{
          marginTop: 40,
          fontWeight: 700,
          cursor: 'pointer'
        }}>
          LOGOUT
        </span>
      </main>


    </div>
  )
}

export default Home
