import styles from '@/styles/Home.module.css'
import { useState } from 'react'
import {useForm} from "react-hook-form"
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {useRouter} from 'next/navigation'


const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("That is not an email").required("Email is required"),
  password: yup.string().min(8, "Password needs to be longer than 8 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords do not match").required("Confirming your password is required")
})

export default function Register() {
  const router = useRouter();

  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmitting = async (data) =>{
    let res = await fetch("https://localhost:5000")

    //router.push(`/success?username=${data.username}`)
  }
  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <form onSubmit={handleSubmit(onSubmitting)} className={styles.inputform} autoComplete='off'> 
            <h3>Login</h3>
            <input type='text' placeholder='Username...' {...register("username")}/>
            <p>{errors.username?.message}</p>
            <input type='text' placeholder='Email...'{...register("email")}/>
            <p>{errors.email?.message}</p>
            <input type='password' placeholder='Password...'{...register("password")}/>
            <p>{errors.password?.message}</p>
            <input type='password' placeholder='Confirm Password...'{...register("confirmPassword")}/>
            <p>{errors.confirmPassword?.message}</p>
           <input type='submit'/>
          </form>
        </div>
      </main>
    </>
  )
}
