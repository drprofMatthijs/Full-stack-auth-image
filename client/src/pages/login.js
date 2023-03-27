import styles from '@/styles/Home.module.css'
import {useForm} from "react-hook-form"

import {yupResolver} from '@hookform/resolvers/yup'
import {useRouter} from 'next/navigation'
import { useState } from 'react'
import {AiOutlineEye} from 'react-icons/ai'



export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")


  const {register, handleSubmit, formState: {errors}} = useForm();

  const onSubmitting = async (data) =>{
    setErrorMessage("")
    let res = await fetch("/api/auth/login", {
      method:"POST",
      body: JSON.stringify({...data}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok){
      setErrorMessage("Invalid Credentials")

    }
    else{
      router.push('/')
    }

  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <form onSubmit={handleSubmit(onSubmitting)} className={styles.inputform} autoComplete='off'> 
            <h3>Login</h3>
            <div>
              <input type='text' placeholder='Email...'{...register("email")}/>
              <p>{errors.email?.message}</p>
            </div>
            <div className={styles.passwordDiv}>
              <input type={showPassword ? 'text' : 'password'} placeholder='Password...'{...register("password")}/>
              <AiOutlineEye className={styles.eyeButton} onClick={() => {setShowPassword(!showPassword)}}/>
              <p>{errors.password?.message}</p>
            </div>
           <input type='submit'/>
           {errorMessage && <p className={styles.loginError}>{errorMessage}</p>}
          </form>
        </div>
      </main>
    </>
  )
}
