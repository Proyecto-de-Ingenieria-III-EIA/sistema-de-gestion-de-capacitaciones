import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { UserInfoDialog } from "./user-info-dialog";

type Props = {
    id: string;
    title: string;
    description: string;
    instructorName: string;
    imageSrc?: string;
}


export default function UserTraining({ id, title, description, instructorName, imageSrc }: Props) {

    return (
        <Card>
            <div className="bg-teal rounded-lg m-2">
                <CardHeader>
                    <CardTitle className="text-2xl text-white">{title}</CardTitle>
                    <CardDescription className="text-white font-light">{description}</CardDescription>
                </CardHeader>
            </div>
                <CardFooter className="flex justify-between mt-5 font-medium text-navy">
                    More info
                    <UserInfoDialog 
                        trainingId={id}
                        title={title}
                        description={description}
                        instructorName={instructorName}
                        imageSrc={imageSrc}
                    />
                </CardFooter>
        </Card>
    )
}