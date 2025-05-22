import { GET_PROGRESS_IN_TRAININGS } from "@/graphql/frontend/users";
import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import TrainingCard from "./training-card";
import { BookCheck, CircleDashed, Icon } from "lucide-react";
import { IconLeft } from "react-day-picker";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import router from 'next/router';

export default function UserProfileTrainings() {

    const { data: session } = useSession();

    const {
        data: progressData,
        loading: progressLoading,
        error: progressError,
      } = useQuery(GET_PROGRESS_IN_TRAININGS, {
        variables: { userId: session?.user?.id },
        skip: !session?.user?.id,
      });

      const trainingProgress = progressData?.getUserProgressForTrainings || [];

      

      return (
        <div className="mt-10">
          <h2 className="text-xl font-semibold flex flex-row gap-2 underline decoration-green-400">
            Completed trainings
            <BookCheck
              color="green"
            />
            </h2>
          <div className=" mt-3 grid grid-cols-2 gap-4">
            {trainingProgress.length === 0 ? (
              <p className='text-gray-500'>User not enrolled in any trainings</p>
            ) : (
              trainingProgress
                .filter((training: any) => training.progress === 100)
                .map((training: any) => (
                  <TrainingCard
                    key={training.id}
                    title={training.trainingTitle}
                    assessments={training.totalAssessments}
                    training={training}
                  />
                ))
            )}
          </div>
          <Button className="mt-4 bg-teal" onClick={() => router.push('/')}>
            Ongoing trainings
            <CircleDashed/>
          </Button>
        </div>
      )

}