import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import { useState } from 'react'


export default function Home() {
  const [privilege, setPrivileg] = useState("")

  const checkUser = async () =>{
    try{ 
      let res = await fetch("/api/checks/logged-user")
      if(!res.ok){
        setPrivileg("You are not logged in")
      }
      else{
        const json = await res.json()
        const userEmail = json.email
        setPrivileg("You are logged in with email: " + userEmail)
      }
    }
    catch(err){
      console.log(err)
    }
  }

  const checkAdmin = async () =>{
    try{ 
      let res = await fetch("/api/checks/logged-admin")
      if(!res.ok){
        setPrivileg("Please login first")
      }
      else{
        const json = await res.json()
        setPrivileg(json === "false" ? "You are not an admin" : "You are an admin!")
      }
    }
    catch(err){
      console.log(err)
    }
  }

  const testRefresh = async () => {
    try{ 
      let res = await fetch("/api/auth/refresh/refresh-token")
      if(!res.ok){
        setPrivileg("Please login first")
      }
      else{
        setPrivileg("Your tokens are refreshed")
      }
    }
    catch(err){
      console.log(err)
    }
  }

  const logoutUser = async () =>{
    try{ 
      let res = await fetch("/api/auth/refresh/logout", {
        method: 'DELETE'
      })
      if(!res.ok){
        setPrivileg("Please login first")
      }
      else{
        setPrivileg("You are logged out!!")
      }
    }
    catch(err){
      console.log(err)
    }
  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1>Welcome to the DrHerreman authentication</h1>
        </div>
        <div className={styles.container}>
          <Link className={styles.link} href='/login'>Login</Link>
          <Link className={styles.link} href='/register'>Register</Link>
        </div>

        <div className={styles.container}>
          <button onClick={checkUser} className={styles.button}>Check logged in</button>
          <button onClick={testRefresh} className={styles.button}>Test refresh</button>
          <button onClick={checkAdmin}className={styles.button}>Check admin</button>
          <button onClick={logoutUser}className={styles.button}>Logout</button>
        </div>

        <div className={styles.container}>
          {privilege && 
          <p className={styles.biggie}>
              {privilege}
          </p> 
          }
        </div>
      </main>
    </>
  )
}
