import PublicTrainings from "@/components/atomic-design/organisms/public-trainings";
import MainLayout from "@/components/layouts/main-layout";
import { GraduationCap } from "lucide-react";


export default function UserTrainings() {
    return (
        <MainLayout>
            <div className="grid grid-cols-1 gap-2">
                <a className="underline decoration-sky-500 text-xl font-bold mb-5 flex flex-row gap-2">
                    Public Trainings
                    <GraduationCap/>
                </a>
                <PublicTrainings />
            </div>
        </MainLayout>
    )
}