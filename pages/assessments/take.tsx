import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  SUBMIT_ASSESSMENT_RESULT,
  GET_ASSESSMENT_BY_ID,
  GET_ASSESSMENT_RESULTS_BY_USER,
} from '@/graphql/frontend/assessments';
import { useSession } from 'next-auth/react';
import { GET_TRAINING_BY_ID } from '@/graphql/frontend/trainings';
import { GET_ASSESSMENT_PROGRESS_BY_TRAINING } from '@/graphql/frontend/users';
import { toast } from 'sonner';

export default function TakeAssessment() {
  const router = useRouter();
  const { id: assessmentId, trainingId } = router.query;
  const { data: session } = useSession();
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});

  const { data, loading, error } = useQuery(GET_ASSESSMENT_BY_ID, {
    variables: { assessmentId },
    skip: !assessmentId,
    context: {
      headers: {
        'session-token': session?.sessionToken,
      },
    },
  });

  const [submitAssessmentResult] = useMutation(SUBMIT_ASSESSMENT_RESULT, {
    context: {
      headers: {
        'session-token': session?.sessionToken,
      },
    },
    refetchQueries: [
      {
        query: GET_TRAINING_BY_ID,
        variables: { trainingId: data?.getAssessmentById?.training.id },
        context: {
          headers: {
            'session-token': session?.sessionToken,
          },
        },
      },
      {
        query: GET_ASSESSMENT_PROGRESS_BY_TRAINING,
        variables: {
          userId: session?.user?.id,
          trainingId: data?.getAssessmentById?.training.id,
        },
        context: {
          headers: {
            'session-token': session?.sessionToken,
          },
        },
      },
      {
        query: GET_ASSESSMENT_RESULTS_BY_USER,
        variables: {
          userId: session?.user?.id,
          trainingId: data?.getAssessmentById?.training.id,
        },
        context: {
          headers: {
            'session-token': session?.sessionToken,
          },
        },
      },
    ],
  });

  const assessment = data?.getAssessmentById;

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await submitAssessmentResult({
        variables: {
          assessmentId,
          userId: session?.user?.id,
          answers: Object.entries(answers).map(
            ([questionId, selectedAnswer]) => ({
              questionId,
              selectedAnswer,
            })
          ),
        },
      });
      toast.success('Assessment Submition Successful', {
        description: `Your assessment was successfully submited. Your score was ${response.data.submitAssessmentResult.score}%`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
      setTimeout(() => {
        window.close();
      }, 3000);
    } catch (err) {
      console.error('Error submitting assessment:', err);
      toast.error('Assessment Submission Failed', {
        description: 'Submission failed. Please try again.',
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading assessment: {error.message}</p>;

  const totalQuestions = assessment.questions.length;
  const answeredQuestions = Object.keys(answers).length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className='max-w-4xl mx-auto mt-8 p-4'>
      {/* Header Section */}
      <div className='bg-blue-500 text-white p-6 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold'>{assessment.title}</h1>
        <p className='mt-2 text-sm'>{assessment.description}</p>
      </div>

      {/* Progress Bar */}
      <div className='mt-6'>
        <div className='w-full bg-gray-200 rounded-full h-4'>
          <div
            className='bg-blue-500 h-4 rounded-full'
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className='text-sm text-gray-600 mt-2'>
          {answeredQuestions} of {totalQuestions} questions answered
        </p>
      </div>

      {/* Questions Section */}
      <form onSubmit={(e) => e.preventDefault()} className='mt-8 space-y-6'>
        {assessment.questions.map((question: any, index: number) => (
          <div
            key={question.id}
            className='bg-white p-6 rounded-lg shadow-md border border-gray-200'
          >
            <h3 className='text-lg font-semibold'>
              {index + 1}. {question.question}
            </h3>
            <div className='mt-4 space-y-2'>
              {question.options.map((option: string, idx: number) => (
                <label
                  key={idx}
                  className={`block p-3 border rounded-lg cursor-pointer ${
                    answers[question.id] === option
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-gray-50 border-gray-300'
                  } hover:bg-blue-50`}
                >
                  <input
                    type='radio'
                    name={question.id}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() => handleAnswerChange(question.id, option)}
                    className='hidden'
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <button
          type='button'
          onClick={handleSubmit}
          className='w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600'
        >
          Submit Assessment
        </button>
      </form>
    </div>
  );
}
