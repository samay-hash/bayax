import React from 'react'
import { motion } from 'framer-motion'

import greenEnergyImg from '../assets/green-energy-ui.png'

const projects = [
    { title: "EdTech Platform", user: "Samay", image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', desc: "AI-driven lesson planning for modern teachers." },
    { title: "SaaS Analytics", user: "Alex", image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', desc: "Dashboard for tracking subscription churn metrics." },
    { title: "Green Energy App", user: "Sarah", image: greenEnergyImg, desc: "Marketplace for solar panel installation and financing." },
    { title: "Creator Economy", user: "Mike", image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', desc: "Tokenized community platform for YouTubers." },
    { title: "Telehealth API", user: "Dr. A", image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', desc: "Secure video conferencing SDK for doctors." },
]

const Testimonials = () => {
    const testiAnimation = {
        initial: { opacity: 0, x: -20 },
        inView: { opacity: 1, x: 0, transition: { duration: .5, ease: 'easeIn' } }
    }
    return (
        <motion.div variants={testiAnimation} initial='initial' whileInView='inView'>
            <ul className='grid sm:grid-cols-5 sm:gap-6 gap-5 mt-10 px-5'>
                {
                    projects.map((proj, index) => (
                        <li key={index} className='bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 p-4 rounded-xl hover:border-cyan-500/30 transition-all duration-300 shadow-lg dark:shadow-none group cursor-pointer'>
                            <div className="h-32 mb-4 overflow-hidden rounded-lg">
                                <img src={proj.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">{proj.title}</h4>
                            <div className='text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed line-clamp-2'>{proj.desc}</div>
                            <div className='flex items-center gap-2'>
                                <div className='w-6 h-6 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center font-bold'>
                                    {proj.user[0]}
                                </div>
                                <p className='text-xs text-cyan-600 dark:text-cyan-400 font-semibold'>Built by {proj.user}</p>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </motion.div>
    )
}

export default Testimonials