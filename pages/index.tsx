import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useId, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import socket from '../utils/socket'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Home: NextPage = (props: any) => {
  const [username, setUsername] = useState('')
  const router = useRouter()

  const onJoin = () => {
    if (username) {
      socket.emit('login', {
        username
      })

      router.push({
        pathname: '/chat',
        query: { username },
      })
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Chat/chit</title>
        <meta name="description" content="Chat & chit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p className={styles.description}>
          <code className={styles.code}>chat/chit</code>
        </p>
        <div className={styles.chatContainer}>
          <input type="text" value={username} placeholder="Enter username" onKeyDown={(e) => {
             if (e.key === 'Enter') {
              onJoin()
            }
          }} onChange={(e) => setUsername(e.target.value)} />
          <button type="button" onClick={onJoin}>JOIN</button>
        </div>
      </main>


    </div>
  )
}

export default Home
