import Footer from '@/components/footer/Footer'
import { HeroSection } from '@/components/heroSection/HeroSection'
import CallToAction from '@/components/home/CallToAction'
import ProblemSection from '@/components/home/ProblemSection'
import TargetUser from '@/components/home/TargetUser'
import WorkersSection from '@/components/home/WorkersSection'
import Navbar from '@/components/navbar/Navbar'

const page = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <WorkersSection />
      <TargetUser />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default page