"use client"
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { RxCross2 } from 'react-icons/rx'
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


type FormState = {
  username: string;
  password: string;
};


const notify = (text: string) => toast.success(text, {
  position: "top-center",
  autoClose: 1000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  transition: Bounce,
});

export default function LoginPage() {
  const [formState, setFormState] = useState<FormState>({
    username: '',
    password: '',
  });

  const { username, password } = formState;


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });

      if (result?.error) {
        console.error('Login error:', result.error);
        notify('Login failed. Please check your credentials.');
      } else {
        notify("Succesfull login ");
        // Optionally handle successful login (e.g., redirect)
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error. Please try again later.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <main className=' w-full bg-[#282828]  h-[80vh] mt-10 px-10 rounded-2xl '>
      <ToastContainer />
      <h1 className='md:text-[48px] text-3xl mt-10 flex text-[#38F68F] justify-between py-5'><span>SignIn here</span> <Link href={'/'} ><RxCross2 className='m-2' /></Link> </h1>
      <section className='flex flex-col items-center  justify-center'>
        <button
          className='bg-white border my-10 border-zinc-300 py-3 flex  rounded-full gap-x-5 pl-5  w-[335px] text-black fony-bold'
          onClick={() => signIn('google', { callbackUrl: '/' })}
        >
          <FcGoogle size={40} /> <div className='text-xl mt-[6px]  '> Continue with Google </div>
        </button>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="username" className="w-[335px] p-2 text-green-500 bg-gray-700 rounded"
            id="username"
            value={username}
            onChange={handleInputChange}
            required
          /><br /><br />
          <input type="password" placeholder="password" className="w-[335px] p-2 text-green-500 bg-gray-700 rounded"
            id="password"
            value={password}
            onChange={handleInputChange}
            required
          /><br /><br />
          <button type="submit" className='p-2  w-[335px] font-bold text-black bg-green-500 rounded'>Sign In</button><br /><br />
          <div className="flex justify-center space-x-1 text-sm text-gray-300">
            <span>Not a member?</span>
            <Link href="/signup" className="font-medium underline text-red-500">
              Sign up
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
