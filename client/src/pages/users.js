import React from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'

export default function Success() {
    const router = useRouter()
    const username = router.query.username
  return (
    <div className={styles.middleman}>
        Hi {username || 'unknown person'}
    </div>
  )
}
