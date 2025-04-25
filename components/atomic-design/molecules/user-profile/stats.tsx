import { GET_USER_PROGRESS } from "@/graphql/frontend/users";
import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";


export default function UserProfileStats() {
    const {data, loading, error} = useQuery(GET_USER_PROGRESS, {
        context: {
              headers: {
                "session-token": useSession()?.data?.sessionToken, 
              },
            }
    })

    if (loading || !data?.getUserProgress) return <div>Loading...</div>;

    const {
        totalTrainings,
        completedTrainings,
        completionRate
    } = data.getUserProgress;

    const stats = [
        { label: "Total Trainings", value: totalTrainings },
        { label: "Completed Trainings", value: completedTrainings },
        { label: "Ongoing Trainings", value: totalTrainings - completedTrainings },
        { label: "Progress", value: `${completionRate}%` },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-4 divide-x text-center mt-4 overflow-hidden">
            {stats.map((stat, index) => (
                <div key={index} className="p-4">
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                    <div className="text-xl font-semibold">{stat.value}</div>
                </div>
            ))}
        </div>
    )
    
}