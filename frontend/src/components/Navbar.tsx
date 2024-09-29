import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import { Link, Outlet } from 'react-router-dom'



function Navbar() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const authToken = localStorage.getItem('token')

  const handleLogin = async () => {
    try {
      const req = await fetch(`${import.meta.env.VITE_PORT}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      const res: { message: string, authtoken: string } = await req.json()
      if (res.message == 'success') {
        console.log(res.authtoken)
        localStorage.setItem('token', res.authtoken)
      }
    } catch (error) {

    }
  }

  const handleSignIn = async () => {
    try {
      const req = await fetch(`${import.meta.env.VITE_PORT}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })
      })
      const res: { message: string, authtoken: string } = await req.json()
      if (res.message == 'success') {
        console.log(res.authtoken)
        localStorage.setItem('token', res.authtoken)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='py-4 px-4'>
      <div className='flex justify-between'>
        <h1 className='text-2xl font-bold'>Edunova Project</h1>
        {authToken ? <div>
          <Link to={'/dashboard'}><Button className='mx-2'>Dashboard</Button></Link>
          <Link to={'/transaction'}><Button className='mx-2'>Transaction</Button></Link>
          <Link to={'/'}><Button className='mx-2'>Home</Button></Link>
        </div> :
          <div>
            <Dialog>
              <DialogTrigger className='bg-black mx-2 px-2 py-1 text-white rounded-md'>SignIn</DialogTrigger>
              <DialogContent>
                <div className='rounded-md flex flex-col px-2'>
                  <label htmlFor="">Name</label>
                  <input onChange={(e) => { setName(e.target.value) }} className='rounded-sm bg-gray-200 px-1' type="text" />
                  <label htmlFor="">Email</label>
                  <input onChange={(e) => { setEmail(e.target.value) }} className='rounded-sm bg-gray-200 px-1' type="email" />
                  <label htmlFor="">Password</label>
                  <input onChange={(e) => { setPassword(e.target.value) }} className='rounded-sm bg-gray-200 px-1' type="password" />
                  <button className='px-1 py-1 bg-black rounded-md text-white text-sm' onClick={handleSignIn}>Submit</button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger className='bg-black px-2 py-1 text-white rounded-md mx-2'>Login</DialogTrigger>
              <DialogContent>
                <div className='rounded-md flex flex-col px-2'>
                  <label htmlFor="">Email</label>
                  <input onChange={(e) => { setEmail(e.target.value) }} className='rounded-sm bg-gray-200 px-1' type="email" />
                  <label htmlFor="">Password</label>
                  <input onChange={(e) => { setPassword(e.target.value) }} className='rounded-sm bg-gray-200 px-1' type="password" />
                  <button className='px-1 py-1 mt-2 bg-black rounded-md text-white text-sm' onClick={handleLogin}>Submit</button>
                </div>
              </DialogContent>
            </Dialog>
          </div>}
      </div>
      <Outlet/>
    </div>
  )
}

export default Navbar