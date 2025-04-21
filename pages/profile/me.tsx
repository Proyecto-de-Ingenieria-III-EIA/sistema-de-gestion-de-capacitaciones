// import { TrainingsList } from "@/components/atomic-design/organisms/trainings-list";
// import AdminLayout from "@/components/layouts/admin-layout";
// import { GET_TRAININGS_BY_USER } from "@/graphql/frontend/trainings";
// import { GET_ASSESSMENT_PROGRESS_BY_TRAINING, GET_USER_PROFILE } from "@/graphql/frontend/users";
// import { useQuery } from "@apollo/client";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/router";

// export default function UserProfile() {
//     const router = useRouter();
//     const { data: session } = useSession();
//     const { id } = router.query;

//     const {data: participantProgress} = useQuery(GET_ASSESSMENT_PROGRESS_BY_TRAINING, {
//     variables: {
//         userId: session?.user?.id,
//         trainingId: id,
//     },
//     context: {
//         headers: {
//             "session-token": session?.sessionToken,
//         },
//     },
//     skip: !id || !session?.user?.id,
//     });

//     const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER_PROFILE, {
//         variables: { id: session?.user?.id },
//         context: {
//           headers: {
//             "session-token": session?.sessionToken,
//           },
//         },
//     });

//     const { data: trainingsData, loading: trainingsLoading, error: trainingsError } = useQuery(GET_TRAININGS_BY_USER, {
//         variables: { userId: session?.user?.id },
//         context: {
//           headers: {
//             "session-token": session?.sessionToken,
//           },
//         },
//     });

//     if (userLoading || trainingsLoading) return <p>Loading profile...</p>;
//   if (userError) return <p>Error loading profile: {userError.message}</p>;
//   if (trainingsError) return <p>Error loading trainings: {trainingsError.message}</p>;

//   const user = userData?.getUserById;
//   const trainings = trainingsData?.getTrainingsByUser;

//   return (
//     <AdminLayout>
//       <div className="max-w-4xl mx-auto mt-8 p-4">
//         <h1 className="text-2xl font-bold mb-6">My Profile</h1>
//         <div className="bg-white shadow-md rounded p-6">
//           <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
//           <div className="mb-4">
//             <strong>Name:</strong> {user.name}
//           </div>
//           <div className="mb-4">
//             <strong>Email:</strong> {user.email}
//           </div>
//           <div className="mb-4">
//             <strong>Area:</strong> {user.area || "Not specified"}
//           </div>
//           <div className="mb-4">
//             <strong>Phone:</strong> {user.phone || "Not specified"}
//           </div>
//           <div className="mb-4">
//             <strong>Role:</strong> {user.role?.name || "Unknown"}
//           </div>
//           <div className="mb-4">
//             <strong>Date Created:</strong> {new Date(user.createdAt).toLocaleDateString()}
//           </div>
//           <div className="mb-4">
//             <strong>Date Updated:</strong> {new Date(user.updatedAt).toLocaleDateString()}
//           </div>
//           <h2 className="text-xl font-semibold mb-4">Trainings</h2>
//           <div className="space-y-4">
//               <TrainingsList trainings={trainings} buttons={[]}/>
//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }