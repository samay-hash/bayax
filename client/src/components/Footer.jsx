import React, { useEffect } from 'react'
import { motion } from 'framer-motion';
import logo from '../assets/bayax.png'
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useRecoilState } from 'recoil';
import { userProfileState } from '../recoil/createUser.recoil';

const Footer = () => {
  const [userProfile, setUserProfile] = useRecoilState(userProfileState)

  useEffect(() => {
    const username = localStorage.getItem('username')
    if (username) setUserProfile(true)
  }, [])

  const footeAnimation = {
    initial: { opacity: 0, x: -40 },
    inView: { opacity: 1, x: 0, transition: { duration: 0.9, ease: 'easeIn' } }
  }
  return (
    <motion.div initial='initial' whileInView='inView' variants={footeAnimation} className='relative flex flex-col items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 sm:mx-20 mx-5 rounded-3xl p-10 mb-10 shadow-2xl'>
      <div className='absolute -top-12'>
        <img src={logo} alt="" className='w-24 h-24 object-contain rounded-xl bg-white border-4 border-slate-100 dark:border-[#020617] shadow-xl p-2' />
      </div>
      <div className='text-center space-y-6 pt-12'>
        <h1 className='sm:text-3xl text-xl font-bold text-slate-200 max-w-2xl leading-relaxed'>
          Boost Your Classroom Environment with <span className="text-cyan-400">AI Powered</span> Lesson Plans
        </h1>
        <div className="flex justify-center">
          {
            !userProfile ? <Button prop={'Get Started Now'} link='/auth/signin' className='mt-5' /> : <Button prop={'Create Lesson Plan'} link='/dashboard' className='mt-5' />
          }
        </div>
      </div>
      <div className='mt-12 pt-6 border-t border-white/5 w-full text-center text-sm text-slate-500'>
        © {new Date().getFullYear()} Created by Samay || All rights reserved.
        <a target='_blank' rel="noreferrer" href="https://x.com/ChemistGamer1" className="ml-2 text-slate-400 hover:text-cyan-400 transition-colors">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      </div>
    </motion.div>
  )
}

export default Footer