'use client'

import { motion } from 'framer-motion'
import HeroSection from '@/components/layout/HeroSection'
import Services from '@/components/sections/Services'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import Members from '@/components/sections/Members'
import Articles from '@/components/sections/Articles'
import Testimonials from '@/components/sections/Testimonials'
import Blogs from '@/components/sections/Blogs'
import Contact from '@/components/sections/Contact'
import CSR from '@/components/sections/CSR'
import Partners from '@/components/sections/Partners'


export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <HeroSection />
      <Services />
      <About />
      {/* <Projects /> */}
      <Members />
      {/* <Articles /> */}
      <Testimonials />
      <Blogs />
      <CSR />
      <Contact />
      <Partners />
    </motion.div>
  )
}