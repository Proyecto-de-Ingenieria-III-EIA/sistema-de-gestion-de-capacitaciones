import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Set headers to prevent caching
  context.res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');

  return {
    props: {}, // will be passed to the page component as props
  };
};

const SignedOutPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">You have been signed out.</h1>
      <p className="text-gray-600 mt-2">See you again soon!</p>
      <a href="/" className="mt-4 text-blue-500 hover:underline">Back to Home</a>
    </div>
  );
};

export default SignedOutPage;
