import { HeroSection } from '@/components/heroSection/HeroSection'
import CallToAction from '@/components/home/CallToAction'
import ProblemSection from '@/components/home/ProblemSection'
import TargetUser from '@/components/home/TargetUser'
import WorkersSection from '@/components/home/WorkersSection'

const page = () => {
  return (
    <div>
      <HeroSection/>
      <ProblemSection />
      <WorkersSection />
      <TargetUser />
      <CallToAction />
    </div>
  )
}

export default page