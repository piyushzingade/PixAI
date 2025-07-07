
import Features from "./Features"
import Footer from "./Footer"
import { HeroSection } from "./Herosection"
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