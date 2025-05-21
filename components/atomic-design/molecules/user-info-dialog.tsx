import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { ENROLL_TO_PUBLIC_TRAINING } from "@/graphql/frontend/enrollments";
import { useMutation } from "@apollo/client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

type Props = {
trainingId: string;
  title: string;
  description: string;
  instructorName: string;
  imageSrc?: string;
};

export function UserInfoDialog( { trainingId, title, description, instructorName, imageSrc }: Props ) {

    const [enrollToPublicTraining, { loading}] = useMutation(
        ENROLL_TO_PUBLIC_TRAINING,
        {
            variables: { trainingId },
            onCompleted: () => {
                toast.success("You have successfully enrolled to this training");
            },
            onError: (error) => {
                toast.error("You are already enrolled to this training");
                console.log(error);
            },
        }
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-skyblue text-navy"><ArrowRight/></Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-xs">
                <DialogHeader>
                    <div className="justify-items-center">
                        <Image
                            src={imageSrc || "https://via.placeholder.com/200x120.png?text=No+Image"}
                            width={200}
                            height={300}
                            alt="Picture of the author"
                            
                        />
                    </div>
                </DialogHeader>
                    <a className="underline decoration-skyblue font-semibold text-xl text-navy">{title}</a>
                <div className="text-sm">
                    <p className="mb-2 text-teal font-light">{description}</p>
                    <Badge className="bg-skyblue text-navy">{instructorName}</Badge>
                </div>
                <div className="grid grid-flow-col justify-items-center-safe mt-3">
                    <Button 
                        onClick={() => enrollToPublicTraining()}
                        disabled={loading}
                        className="bg-navy text-white rounded-2xl"
                    >{loading ? "Enrolling..." : "Enroll to this training"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}