
import Features from "./Features"
import Footer from "./Footer"
import { HeroSection } from "./HeroSection"
import Topbar from "./Topbar"

export const LandingPage = () => {
    return (
        <div className="">
            <Topbar/>
            <HeroSection/>
            <Features/>
            <Footer/>
        </div>
    )
}