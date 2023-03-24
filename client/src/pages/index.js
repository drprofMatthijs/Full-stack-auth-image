import styles from '@/styles/Home.module.css'
import {useForm} from "react-hook-form"
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {useRouter} from 'next/navigation'


const schema = yup.object().shape({
  email: yup.string().email("That is not an email").required("Email is required"),
  password: yup.string().min(8, "Password needs to be longer than 8 characters").required("Password is required")

})

export default function Home() {
  const router = useRouter();


  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmitting = async (data) =>{
    let res = await fetch("/api/auth/login", {
      method:"POST",
      body: JSON.stringify({...data}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    //SET USER CONTEXT HERE TO ACCESS IT IN EVERY PAGE

    router.push('/success')
  }
  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <form onSubmit={handleSubmit(onSubmitting)} className={styles.inputform} autoComplete='off'> 
            <h3>Login</h3>
            <input type='text' placeholder='Email...'{...register("email")}/>
            <p>{errors.email?.message}</p>
            <input type='password' placeholder='Password...'{...register("password")}/>
            <p>{errors.password?.message}</p>
           <input type='submit'/>
          </form>
        </div>
      </main>
    </>
  )
}
