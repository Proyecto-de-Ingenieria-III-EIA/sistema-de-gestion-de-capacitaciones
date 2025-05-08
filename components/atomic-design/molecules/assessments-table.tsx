import { useRef, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_ASSESSMENTS,
  CREATE_ASSESSMENT,
  ADD_QUESTION,
  EDIT_QUESTION,
  DELETE_QUESTION,
  DELETE_ASSESSMENT,
  GET_ASSESSMENT_RESULTS_BY_USER,
  EDIT_ASSESSMENT,
} from '@/graphql/frontend/assessments';
import { useSession } from 'next-auth/react';
import { Assessment } from '@prisma/client';
import { useRouter } from 'next/router';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

interface AssessmentsTableProps {
  trainingId: string;
  renderAction?: (assessment: Assessment) => React.ReactNode;
  canModifyAssessment: boolean;
  refetchProgress?: () => void;
}

export default function AssessmentsTable({
  trainingId,
  renderAction,
  canModifyAssessment,
  refetchProgress
}: AssessmentsTableProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<
    string | null
  >(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [answer, setAnswer] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const questionsSectionRef = useRef<HTMLDivElement | null>(null);
  const [firstQuestion, setFirstQuestion] = useState('');
  const [firstOptions, setFirstOptions] = useState<string[]>([]);
  const [firstAnswer, setFirstAnswer] = useState('');
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(null);
  const [newAssessmentTitle, setNewAssessmentTitle] = useState('');

  const handleTakeAssessment = (assessmentId: string) => {
    const assessmentUrl = `/assessments/take?id=${assessmentId}&trainingId=${trainingId}`;
    window.open(assessmentUrl, '_blank');

    setTimeout(() => {
      refetchResults();
      if (refetchProgress) {
        refetchProgress();
      }

      toast.info('Results Updated', {
        description: 'Your assessment results have been updated.',
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }, 5000);
  };

  const handleOpenQuestions = (assessmentId: string) => {
    setSelectedAssessmentId(assessmentId);

    setTimeout(() => {
      questionsSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 0);
  };

  const { data } = useQuery(GET_ASSESSMENTS, {
    variables: { trainingId },
  });

  const { data: resultsData, refetch: refetchResults } = useQuery(GET_ASSESSMENT_RESULTS_BY_USER, {
    variables: {
      userId: session?.user?.id,
      trainingId: trainingId,
    },
    skip: !trainingId || !session?.user?.id,
  });

  const [createAssessment] = useMutation(CREATE_ASSESSMENT);

  const [editAssessment] = useMutation(EDIT_ASSESSMENT, {
    refetchQueries: [{ query: GET_ASSESSMENTS }],
  });

  const [deleteAssessment] = useMutation(DELETE_ASSESSMENT, {
    refetchQueries: ['GetAssessments'],
  });

  const [addQuestion] = useMutation(ADD_QUESTION);

  const [editQuestion] = useMutation(EDIT_QUESTION, {
    refetchQueries: ['GetAssessments'],
  });

  const [deleteQuestion] = useMutation(DELETE_QUESTION, {
    refetchQueries: ['GetAssessments'],
  });

  const handleAddAssessment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim().length < 3) {
      return toast.error('Error', {
        description: 'The assessment name must be at least 3 characters long.',
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }

    if (!firstQuestion.trim() || firstOptions.length < 2 || !firstAnswer.trim()) {
      return toast.error('Error', {
        description:
          'The first question must have text, at least two options, and a correct answer.',
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }

    if (!firstOptions.includes(firstAnswer)) {
      return toast.error('Error', {
        description: 'The answer must be one of the provided options.',
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }

    try {
      const { data: assessmentData } = await createAssessment({
        variables: { trainingId, title },
        refetchQueries: [
          {
            query: GET_ASSESSMENTS,
            variables: { trainingId },
          },
        ]
      });

      const newAssessmentId = assessmentData.createAssessment.id;

      await addQuestion({
        variables: {
          assessmentId: newAssessmentId,
          question: firstQuestion,
          options: firstOptions,
          answer: firstAnswer,
        },
        refetchQueries: [{ query: GET_ASSESSMENTS, variables: { trainingId } }],
      });

      toast.success('Assessment Created Successfully', {
        description: `The assessment "${title}" has been created with the first question.`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });

      setTitle('');
      setFirstQuestion('');
      setFirstOptions([]);
      setFirstAnswer('');
    } catch (err) {
      console.error('Error creating assessment or adding question:', err);
      toast.error('Error', {
        description: 'There was an error creating the assessment. Please try again.',
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  const handleEditAssessment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newAssessmentTitle.trim().length < 3) {
      return toast.error('Error', {
        description: 'The assessment name must be at least 3 characters long.',
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }

    try {
      await editAssessment({
        variables: {
          assessmentId: editingAssessmentId,
          title: newAssessmentTitle,
        },
      });

      toast.success('Assessment Updated Successfully', {
        description: `The assessment name has been updated to "${newAssessmentTitle}".`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });

      setEditingAssessmentId(null);
      setNewAssessmentTitle('');
    } catch (err) {
      console.error('Error updating assessment:', err);
      toast.error('Error', {
        description: 'There was an error updating the assessment. Please try again.',
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  const handleDeleteAssessment = async (assessmentId: string) => {
    try {
      await deleteAssessment({ variables: { assessmentId: assessmentId } });
      toast.success('Assessment Deletion Success', {
        description: `The assessment has been deleted successfully.`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    } catch (err) {
      console.error('Error deleting assessment:', err);
      toast.error('Error Deleting Assessment', {
        description: `The assessment could not be deleted. Please try again.`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssessmentId) {
      return toast.info('No Assessment Selected', {
        description: `Please select an assessment to add a question.`,
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }

    if (!question.trim() || options.length < 2 || !answer.trim()) {
      return toast.error('Error', {
        description: 'A question must have text, at least two options, and an answer.',
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }

    if (!options.includes(answer)) {
      return toast.error('Error', {
        description: 'The answer must be one of the provided options.',
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(),
        },
      });
    }

    try {
      if (editingQuestionId) {
        await editQuestion({
          variables: {
            questionId: editingQuestionId,
            question,
            options,
            answer,
          },
        });
        toast.success('Question Modified Successfully', {
          description: `The question has been modified successfully.`,
          action: {
            label: 'Dismiss',
            onClick: () => toast.dismiss(),
          },
        });
        setEditingQuestionId(null);
      } else {
        await addQuestion({
          variables: {
            assessmentId: selectedAssessmentId,
            question,
            options,
            answer,
          },
          refetchQueries: [
            {
              query: GET_ASSESSMENTS,
              variables: { trainingId },
            },
          ],
        });
        toast.success('Question Added Successfully', {
          description: `The question has been added successfully.`,
          action: {
            label: 'Dismiss',
            onClick: () => toast.dismiss(),
          },
        });
      }

      setQuestion('');
      setOptions([]);
      setAnswer('');
    } catch (err) {
      console.error('Error saving question:', err);
    }
  };

  return (
    <div className='mt-8'>
      <h2 className='text-xl font-semibold mb-4'>Assessments</h2>

      {/* Add/Edit Assessment Form */}
      {canModifyAssessment && (
        <form onSubmit={handleAddAssessment} className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Assessment Title"
              className="flex-1 border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium">First Question:</label>
            <input
              type="text"
              value={firstQuestion}
              onChange={(e) => setFirstQuestion(e.target.value)}
              placeholder="Enter the first question"
              className="block w-full text-sm border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium">
              Options (comma-separated):
            </label>
            <input
              type="text"
              value={firstOptions.join(',')}
              onChange={(e) => setFirstOptions(e.target.value.split(','))}
              placeholder="Enter options"
              className="block w-full text-sm border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium">Correct Answer:</label>
            <input
              type="text"
              value={firstAnswer}
              onChange={(e) => setFirstAnswer(e.target.value)}
              placeholder="Enter the correct answer"
              className="block w-full text-sm border border-gray-300 rounded-lg p-2"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mt-4"
          >
            Add Assessment
          </button>
        </form>
      )}

      {/* Assessments List */}
      {data && data.getAssessments && (
        <div className='space-y-4 text'>
          {data.getAssessments.map((assessment: any) => {
            const userResults = resultsData?.getAssessmentResultsByUser?.filter(
              (result: any) => result.assessment.id === assessment.id
            );

            const highestScore = userResults?.length
              ? Math.max(...userResults.map((result: any) => result.score))
              : 0;

            return (
              <div
                key={assessment.id}
                className='border border-gray-300 rounded-lg p-4 shadow-sm flex-col items-center text-center'
              >
                <div className='flex justify-between items-center'>
                  {/* Inline Edit Form for Assessment Title */}
                  {editingAssessmentId === assessment.id ? (
                    <form onSubmit={handleEditAssessment} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newAssessmentTitle}
                        onChange={(e) => setNewAssessmentTitle(e.target.value)}
                        placeholder="Enter new title"
                        className="border border-gray-300 rounded-lg p-2"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAssessmentId(null);
                          setNewAssessmentTitle('');
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <h3 className='text-lg font-semibold'>{assessment.title}</h3>
                      {canModifyAssessment && (
                        <button
                          onClick={() => {
                            setEditingAssessmentId(assessment.id);
                            setNewAssessmentTitle(assessment.title);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                      )}
                    </>
                  )}

                  {canModifyAssessment && (
                    <button
                      onClick={() => handleOpenQuestions(assessment.id)}
                      className='text-blue-500 hover:text-blue-700'
                    >
                      Manage Questions
                    </button>
                  )}
                  {canModifyAssessment && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className='text-red-500 hover:text-red-700'>
                          <TrashIcon className='w-5 h-5' />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className='bg-white'>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The assessment will be
                            permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDeleteAssessment(assessment.id)
                            }
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {/* Render Action Button */}
                  {renderAction ? renderAction(assessment) : null}
                </div>

                {/* Highest Score and Take Assessment Button */}
                {!canModifyAssessment && (
                  <div className='mt-4'>
                    {highestScore !== null && (
                      <p className='text-gray-700'>
                        Highest Score: {highestScore}%
                      </p>
                    )}
                    <button
                      onClick={() => handleTakeAssessment(assessment.id)}
                      className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mt-2'
                    >
                      Take Assessment
                    </button>
                  </div>
                )}

                {/* Questions Section */}
                {selectedAssessmentId === assessment.id && (
                  <div ref={questionsSectionRef} className='mt-4'>
                    <div className='flex justify-between items-center mb-2'>
                      <h4 className='text-md font-semibold'>Questions</h4>
                      <button
                        onClick={() => setSelectedAssessmentId(null)}
                        className='text-red-500 hover:text-red-700 text-sm'
                      >
                        Close
                      </button>
                    </div>
                    {assessment.questions.length > 0 ? (
                      <table className='min-w-full border-collapse border border-gray-300'>
                        <thead>
                          <tr>
                            <th className='border border-gray-300 px-4 py-2'>
                              Question
                            </th>
                            <th className='border border-gray-300 px-4 py-2'>
                              Options
                            </th>
                            <th className='border border-gray-300 px-4 py-2'>
                              Answer
                            </th>
                            <th className='border border-gray-300 px-4 py-2'>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {assessment.questions.map((q: any) => (
                            <tr key={q.id}>
                              <td className='border border-gray-300 px-4 py-2'>
                                {q.question}
                              </td>
                              <td className='border border-gray-300 px-4 py-2'>
                                {q.options.join(', ')}
                              </td>
                              <td className='border border-gray-300 px-4 py-2'>
                                {q.answer}
                              </td>
                              <td className='border border-gray-300 px-4 py-2 flex gap-2'>
                                <button
                                  onClick={() => {
                                    setEditingQuestionId(q.id);
                                    setQuestion(q.question);
                                    setOptions(q.options);
                                    setAnswer(q.answer);
                                  }}
                                  className='text-yellow-500 hover:text-yellow-700'
                                >
                                  <PencilIcon className='w-5 h-5' />
                                </button>
                                <button
                                  onClick={() =>
                                    deleteQuestion({
                                      variables: { questionId: q.id },
                                    })
                                  }
                                  className='text-red-500 hover:text-red-700'
                                >
                                  <TrashIcon className='w-5 h-5' />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No questions found.</p>
                    )}

                    {/* Add Question Form */}
                    <form onSubmit={handleAddQuestion} className='mt-4'>
                      <div className='mb-2'>
                        <label className='block text-sm font-medium'>
                          Question:
                        </label>
                        <input
                          type='text'
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder='Enter question'
                          className='block w-full text-sm border border-gray-300 rounded-lg p-2'
                        />
                      </div>
                      <div className='mb-2'>
                        <label className='block text-sm font-medium'>
                          Options (comma-separated):
                        </label>
                        <input
                          type='text'
                          value={options.join(',')}
                          onChange={(e) =>
                            setOptions(e.target.value.split(','))
                          }
                          placeholder='Enter options'
                          className='block w-full text-sm border border-gray-300 rounded-lg p-2'
                        />
                      </div>
                      <div className='mb-2'>
                        <label className='block text-sm font-medium'>
                          Answer:
                        </label>
                        <input
                          type='text'
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder='Enter correct answer'
                          className='block w-full text-sm border border-gray-300 rounded-lg p-2'
                        />
                      </div>
                      <button
                        type='submit'
                        className={`px-4 py-2 ${editingQuestionId
                            ? 'bg-yellow-500 hover:bg-yellow-700'
                            : 'bg-green-500 hover:bg-green-700'
                          } text-white rounded`}
                      >
                        {editingQuestionId ? 'Edit Question' : 'Add Question'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Fallback for No Assessments */}
      {data && data.getAssessments && data.getAssessments.length === 0 && (
        <p className='text-gray-500 text-center'>No assessments available.</p>
      )}
    </div>
  );
}
