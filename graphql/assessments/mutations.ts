import { Context } from '@/types';
import { validateRole } from '@/utils/validateRole';

export const mutations = {
  // Create a new assessment
  createAssessment: async (
    _: unknown,
    args: { trainingId: string; title: string },
    { db, authData }: Context
  ) => {

    await validateRole(db, authData, ['ADMIN', 'INSTRUCTOR']);

    return db.assessment.create({
      data: {
        trainingId: args.trainingId,
        title: args.title,
      },
    });
  },

  // Add a question to an assessment
  addQuestion: async (
    _: unknown,
    args: {
      assessmentId: string;
      question: string;
      options: string[];
      answer: string;
    },
    { db, authData }: Context
  ) =>{

    await validateRole(db, authData, ['ADMIN', 'INSTRUCTOR']);

    if (!args.options.includes(args.answer)) {
      throw new Error('Answer must be one of the options');
    }

    // la capacitacion debe estar escondida antes de modificar preguntas
    const assessment = await db.assessment.findUnique({
      where: { id: args.assessmentId },
      include: { training: { select: { isHidden: true } } },
    });

    if (!assessment) {
      throw new Error("Assessment not found.");
    }
    if (!assessment.training.isHidden) {
      throw new Error("Questions can only be modified when the training is hidden.");
    }

    return db.question.create({
      data: {
        assessmentId: args.assessmentId,
        question: args.question,
        options: args.options,
        answer: args.answer,
      },
    });
  },


  editQuestion: async (
    _: unknown,
    args: {
      questionId: string;
      question?: string;
      options?: string[];
      answer?: string;
    },
    { db, authData }: Context
  ) => {

    await validateRole(db, authData, ['ADMIN', 'INSTRUCTOR']);

    
    const existingQuestion = await db.question.findUnique({
      where: { id: args.questionId },
      include: { assessment: { include: { training: { select: { isHidden: true } } } } },
    });

    if (!existingQuestion) {
      throw new Error('Question not found.');
    }

    if (!existingQuestion.assessment.training.isHidden) {
      throw new Error('Questions can only be edited when the training is hidden.');
    }

    
    if (args.answer && args.options && !args.options.includes(args.answer)) {
      throw new Error('Answer must be one of the options.');
    }

    return db.question.update({
      where: { id: args.questionId },
      data: {
        question: args.question ?? existingQuestion.question,
        options: args.options ?? existingQuestion.options,
        answer: args.answer ?? existingQuestion.answer,
      },
    });
  },

 

  // Submit an assessment result
  submitAssessmentResult: async (
    _: unknown,
    args: { assessmentId: string; userId: string; answers: { questionId: string; selectedAnswer: string }[] },
    { db }: Context
  ) => {

    // traer las repsuestas correctas
    const questions = await db.question.findMany({
      where: { assessmentId: args.assessmentId },
      select: { id: true, answer: true },
    });

    if ( questions.length === 0 ) {
      throw new Error('Assessment has no questions');
    }

    // autoevaluar
    let correctAnswers = 0;
    for  (const answer of args.answers) {
      const question = questions.find( q => q.id === answer.questionId);
      if (question?.answer === answer.selectedAnswer) {
        correctAnswers++;
      }
    }

    const score = (correctAnswers / questions.length) * 100;

    return db.assessmentResult.create({
      data: {
        assessmentId: args.assessmentId,
        userId: args.userId,
        score
      },
    });
  }
};
