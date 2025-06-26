import { ImageGenerationCard } from "@/components/dashboard/ImageGenerationCard";
import Sidebar from "@/components/dashboard/Sidebar";



export default function Dashboard() {
    return (
      <div className="flex w-full h-screen">
        <Sidebar />
        <div className="max-h-screen w-full ">
          <ImageGenerationCard />
        </div>
      </div>
    );
}