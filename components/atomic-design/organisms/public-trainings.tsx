import { useQuery } from "@apollo/client";
import UserTraining from "../molecules/user-training";
import { GET_PUBLIC_TRAININGS } from "@/graphql/frontend/trainings";


export default function PublicTrainings() {

    const { data, loading, error } = useQuery(GET_PUBLIC_TRAININGS);

     if (loading) return <p className="text-center">Loading trainings...</p>;
     if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

    return (
        <div className="grid grid-cols-4 gap-4">
            {data.getPublicTrainings.map(( training: any ) => (
                <UserTraining 
                    key={training.id}
                    id={training.id}
                    title={training.title}
                    description={training.description}
                    instructorName={training.instructor?.name || "Sin instructor"}
                    imageSrc={training.imageSrc}
                />
            ))}
        </div>
    );
}