import { Context } from '@/types';
import { validateRole } from '@/utils/validateRole';

export const mutations = {
  // Training materials mutations
  createTrainingMaterial: async (
    _: unknown,
    args: { trainingId: string; fileType: string; fileUrl: string },
    { db, authData }: Context
  ) => {

    await validateRole( db, authData, ['ADMIN', 'INSTRUCTOR']);
  
    const training = await db.training.findUnique({
      where: { id: args.trainingId },
    });

    if (!training) {
      throw new Error('Training not found');
    }

    return db.trainingMaterial.create({
      data: {
        trainingId: training.id,
        fileType: args.fileType,
        fileUrl: args.fileUrl,
      },
      include: { training: true },
    });
  },

  updateTrainingMaterial: async (
    _: unknown,
    args: { id: string; fileType?: string; fileUrl?: string },
    { db, authData }: Context
  ) => {

    await validateRole( db, authData, ['ADMIN', 'INSTRUCTOR']);
    
    const trainingMaterialExists = await db.trainingMaterial.findUnique({
      where: { id: args.id },
    });

    if (!trainingMaterialExists) {
      throw new Error('Training material not found');
    }

    return db.trainingMaterial.update({
      where: { id: args.id },
      data: {
        fileType: args.fileType ?? trainingMaterialExists.fileType,
        fileUrl: args.fileUrl ?? trainingMaterialExists.fileUrl,
      },
      include: { training: true },
    });
  },

  deleteTrainingMaterial: async (
    _: unknown,
    args: { id: string },
    { db, authData }: Context
  ) => {
    await validateRole( db, authData, ['ADMIN', 'INSTRUCTOR']);
    return db.trainingMaterial.delete({ where: { id: args.id } });
  },
  // Training mutations
  createTraining: async (
    _: unknown,
    args: { title: string; description: string; instructorId: string },
    { db, authData }: Context
  ) =>{
    validateRole( db, authData, ['ADMIN']);

    return db.training.create({
      data: {
        title: args.title,
        description: args.description,
        instructorId: args.instructorId,
        isHidden: true,
      },
      include: { instructor: true },
    });
  },

  updateTraining: async (
    _: unknown,
    args: {
      id: string;
      title?: string;
      description?: string;
      isHidden?: boolean;
      isPublic?: boolean;
      instructorId?: string;
    },
    { db, authData }: Context
  ) => {
    await validateRole(db, authData, ['ADMIN', 'INSTRUCTOR']);
  
    const existingTraining = await db.training.findUnique({
      where: { id: args.id },
    });
  
    if (!existingTraining) {
      throw new Error('Training not found');
    }
  
    return db.training.update({
      where: { id: args.id },
      data: {
        title: args.title ?? existingTraining.title,
        description: args.description ?? existingTraining.description,
        isHidden: args.isHidden ?? existingTraining.isHidden,
        isPublic: args.isPublic ?? existingTraining.isPublic,
        instructorId: args.instructorId ?? existingTraining.instructorId,
      },
      include: { instructor: true },
    });
  },

  deleteTraining: async (_: unknown, args: { id: string }, { db, authData}: Context) => {
    await validateRole(db, authData, ["ADMIN"]);
    
      const training = await db.training.findUnique({
        where: { id: args.id },
      });
    
      if (!training) {
        throw new Error("Training not found");
      }
      
    return db.training.delete({ where: { id: training.id } });
  },

  // Instructor
  assignInstructorToTraining: async (
    _: unknown,
    args: { trainingId: string; instructorId: string },
    { db }: Context
  ) => {
    const instructor = await db.user.findUnique({
      where: { id: args.instructorId },
      select: { role: {select: {name: true}}},
    });

    //verificar que solo podamos agregar instructores
    if (!instructor || instructor.role.name !== 'INSTRUCTOR') {
      throw new Error('Instructor not found or not an instructor');
    }

    const existingTraining = await db.training.findUnique({
      where: { id: args.trainingId },
      select: { instructorId: true },
    });

    //verifica si ya tiene un instructor para cambiarlo
    if(existingTraining?.instructorId) {
      return db.training.update({
        where: { id: args.trainingId},
        data: { instructorId: args.instructorId},
      });
    }

    // si esta en null, lo agrega normalmente
    return db.training.update({
      where: { id: args.trainingId},
      data: { instructorId: args.instructorId},
    })
  },

  toggleTrainingVisibility: async (
    _: unknown,
    args: { trainingId: string },
    { db, authData }: Context
  ) => {
    await validateRole( db, authData, ['ADMIN', 'INSTRUCTOR']);

    const training = await db.training.findUnique({
      where: { id: args.trainingId },
      select: { isHidden: true },
    });

    if (!training) {
      throw new Error('Training not found');
    }

    return db.training.update({
      where: { id: args.trainingId },
      data: { isHidden: !training.isHidden },
    });

  },

  duplicateTraining: async (
    _: unknown,
    args: { trainingId: string },
    { db, authData }: Context
  ) => {
    await validateRole(db, authData, ['ADMIN', 'INSTRUCTOR']);
  
    const existingTraining = await db.training.findUnique({
      where: { id: args.trainingId },
      include: {
        materials: true,
        assessments: {
          include: {
            questions: true,
          },
        },
        enrollments: true,
        forumPosts: true,
        instructor: true,
      },
    });
  
    if (!existingTraining) {
      throw new Error('Training not found');
    }
  
    const duplicatedTraining = await db.training.create({
      data: {
        title: `${existingTraining.title} (Copy)`,
        description: existingTraining.description,
        isHidden: true, 
        isPublic: false,
        imageSrc: existingTraining.imageSrc,
        instructorId: existingTraining.instructorId,
  
        materials: {
          create: existingTraining.materials.map((material) => ({
            fileType: material.fileType,
            fileUrl: material.fileUrl,
          })),
        },
  
        // Duplicate assessments with their questions
        assessments: {
          create: existingTraining.assessments.map((assessment) => ({
            title: assessment.title,
            questions: {
              create: assessment.questions.map((question) => ({
                question: question.question,
                options: question.options,
                answer: question.answer,
              })),
            },
          })),
        },
      },
      include: {
        materials: true,
        assessments: {
          include: {
            questions: true,
          },
        },
        instructor: true,
      },
    });
  
    return duplicatedTraining;
  },
  
};
