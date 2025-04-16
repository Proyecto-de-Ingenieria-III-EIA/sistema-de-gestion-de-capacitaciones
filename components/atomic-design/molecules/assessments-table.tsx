import { useRef, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ASSESSMENTS,
  CREATE_ASSESSMENT,
  ADD_QUESTION,
  EDIT_QUESTION,
  DELETE_QUESTION,
} from "@/graphql/frontend/assessments";
import { useSession } from "next-auth/react";
import { PlusIcon, TrashIcon, PencilIcon } from "lucide-react";

interface AssessmentsTableProps {
  trainingId: string;
}

export default function AssessmentsTable({ trainingId }: AssessmentsTableProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const questionsSectionRef = useRef<HTMLDivElement | null>(null); // Ref for the questions section

  const handleOpenQuestions = (assessmentId: string) => {
    setSelectedAssessmentId(assessmentId);

    // Scroll the questions section into view
    setTimeout(() => {
      questionsSectionRef.current?.scrollIntoView({
        behavior: "smooth", // Smooth scrolling
        block: "start", // Align to the top of the viewport
      });
    }, 0);
  };

  const { data, loading, error } = useQuery(GET_ASSESSMENTS, {
    variables: { trainingId },
    context: {
      headers: {
        "session-token": session?.sessionToken,
      },
    },
  });

  const [createAssessment] = useMutation(CREATE_ASSESSMENT, {
    refetchQueries: ["GetAssessments"],
    context: {
      headers: {
        "session-token": session?.sessionToken,
      },
    },
  });

  const [addQuestion] = useMutation(ADD_QUESTION, {
    refetchQueries: ["GetAssessments"],
    context: {
      headers: {
        "session-token": session?.sessionToken,
      },
    },
  });

  const [editQuestion] = useMutation(EDIT_QUESTION, {
    refetchQueries: ["GetAssessments"],
    context: {
      headers: {
        "session-token": session?.sessionToken,
      },
    },
  });

  const [deleteQuestion] = useMutation(DELETE_QUESTION, {
    refetchQueries: ["GetAssessments"],
    context: {
      headers: {
        "session-token": session?.sessionToken,
      },
    },
  });

  const handleAddAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAssessment({ variables: { trainingId, title } });
      alert("Assessment created successfully!");
      setTitle("");
    } catch (err) {
      console.error("Error creating assessment:", err);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssessmentId) return alert("Select an assessment first.");
  
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
        alert("Question updated successfully!");
        setEditingQuestionId(null); 
      } else {
        await addQuestion({
          variables: {
            assessmentId: selectedAssessmentId,
            question,
            options,
            answer,
          },
        });
        alert("Question added successfully!");
      }
  
      setQuestion("");
      setOptions([]);
      setAnswer("");
    } catch (err) {
      console.error("Error saving question:", err);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Assessments</h2>

      {/* Add/Edit Assessment Form */}
      <form onSubmit={handleAddAssessment} className="mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Assessment Title"
            className="flex-1 border border-gray-300 rounded-lg p-2"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Add Assessment
          </button>
        </div>
      </form>

      {/* Assessments List */}
      {data && data.getAssessments && (
        <div className="space-y-4">
          {data.getAssessments.map((assessment: any) => (
            <div
              key={assessment.id}
              className="border border-gray-300 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{assessment.title}</h3>
                <button
                  onClick={() => handleOpenQuestions(assessment.id)} // Open questions and scroll
                  className="text-blue-500 hover:text-blue-700"
                >
                  Manage Questions
                </button>
              </div>

              {/* Questions Section */}
              {selectedAssessmentId === assessment.id && (
                <div ref={questionsSectionRef} className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-md font-semibold">Questions</h4>
                    <button
                      onClick={() => setSelectedAssessmentId(null)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Close
                    </button>
                  </div>
                  {assessment.questions.length > 0 ? (
                    <table className="min-w-full border-collapse border border-gray-300">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 px-4 py-2">Question</th>
                          <th className="border border-gray-300 px-4 py-2">Options</th>
                          <th className="border border-gray-300 px-4 py-2">Answer</th>
                          <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assessment.questions.map((q: any) => (
                          <tr key={q.id}>
                            <td className="border border-gray-300 px-4 py-2">{q.question}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              {q.options.join(", ")}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{q.answer}</td>
                            <td className="border border-gray-300 px-4 py-2 flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingQuestionId(q.id);
                                  setQuestion(q.question);
                                  setOptions(q.options);
                                  setAnswer(q.answer);
                                }}
                                className="text-yellow-500 hover:text-yellow-700"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => deleteQuestion({ variables: { questionId: q.id } })}
                                className="text-red-500 hover:text-red-700"
                              >
                                <TrashIcon className="w-5 h-5" />
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
                  <form onSubmit={handleAddQuestion} className="mt-4">
                    <div className="mb-2">
                      <label className="block text-sm font-medium">Question:</label>
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter question"
                        className="block w-full text-sm border border-gray-300 rounded-lg p-2"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium">
                        Options (comma-separated):
                      </label>
                      <input
                        type="text"
                        value={options.join(",")}
                        onChange={(e) => setOptions(e.target.value.split(","))}
                        placeholder="Enter options"
                        className="block w-full text-sm border border-gray-300 rounded-lg p-2"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium">Answer:</label>
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter correct answer"
                        className="block w-full text-sm border border-gray-300 rounded-lg p-2"
                      />
                    </div>
                    <button
                      type="submit"
                      className={`px-4 py-2 ${
                        editingQuestionId ? "bg-yellow-500 hover:bg-yellow-700" : "bg-green-500 hover:bg-green-700"
                      } text-white rounded`}
                    >
                      {editingQuestionId ? "Edit Question" : "Add Question"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}