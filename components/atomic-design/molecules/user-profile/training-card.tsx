import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { toast } from "sonner";


export default function TrainingCard({ title, assessments, training}: { title?: string, assessments?: number, training?: any }) {

    const { data: session } = useSession();

    const handleNavigateToCertificate = (training: any) => {
        if (training.progress === 100) {
          const trainingName = encodeURIComponent(training?.trainingTitle || 'Training');
          const userName = encodeURIComponent(session?.user?.name || 'User');
          const certificateUrl = `/trainings/certificate?id=${session?.user?.id}&trainingName=${trainingName}&userName=${userName}`;
          window.open(certificateUrl, '_blank');
        } else {
          toast.info(
            'You must complete the training before you can access the certificate.'
          );
        }
      };
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <h1 className="font-semibold">{title}</h1>
                    <p className="font-light text-sm">Total assessments: {assessments}</p>
                </div>
                <Button 
                    className="bg-green-400"
                    onClick={() => handleNavigateToCertificate(training)}
                >Certificate</Button>
            </CardHeader>
        </Card>
    )
}