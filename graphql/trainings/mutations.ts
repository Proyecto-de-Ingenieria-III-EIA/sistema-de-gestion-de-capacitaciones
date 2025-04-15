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
  
    const trainingExists = await db.training.findUnique({
      where: { id: args.trainingId },
    });

    if (!trainingExists) {
      throw new Error('Training not found');
    }

    //file size validation

    return db.trainingMaterial.create({
      data: {
        trainingId: args.trainingId,
        fileType: args.fileType,
        fileUrl: args.fileUrl,
      },
    });
  },

  updateTrainingMaterial: async (
    _: unknown,
    args: { id: string; fileType?: string; fileUrl?: string },
    { db }: Context
  ) => {
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
    });
  },

  deleteTrainingMaterial: async (
    _: unknown,
    args: { id: string },
    { db }: Context
  ) => {
    await db.trainingMaterial.delete({ where: { id: args.id } });
    return true;
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
    },
    { db }: Context
  ) =>
    db.training.update({
      where: { id: args.id },
      data: {
        title: args.title,
        description: args.description,
        isHidden: args.isHidden,
      },
    }),

  deleteTraining: async (_: unknown, args: { id: string }, { db }: Context) => {
    await db.training.delete({ where: { id: args.id } });
    return true;
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
      select: { isHidden: true }, // nos significa que isHidden sea true, sino que va a buscar solo el isHidden field
    });

    if (!training) {
      throw new Error('Training not found');
    }

    return db.training.update({
      where: { id: args.trainingId },
      data: { isHidden: !training.isHidden }, // cambiar visibilidad
    });

  },

  duplicateTraining: async (
    _: unknown,
    args: { trainingId: string },
    { db, authData }: Context
  ) => {

    
    await validateRole( db, authData, ['ADMIN', 'INSTRUCTOR']);

    const existingTraining = await db.training.findUnique({
      where: { id: args.trainingId },
      include: {
        materials: true,
        assessments: true,
        enrollments: true,
        forumPosts: true,
      },
    });

    if (!existingTraining) {
      throw new Error('Training not found');
    }

    const duplicatedTraining = await db.training.create({
      data: {
        title: `${existingTraining.title} (Copy)`,
        description: existingTraining.description,
        // la copia es escondida
        isHidden: true,
        isPublic: false,
        

        materials: {
          create: existingTraining.materials.map(material => ({
            fileType: material.fileType,
            fileUrl: material.fileUrl,
          })),
        },
        assessments: {
          create: existingTraining.assessments.map(assesment => ({
            title: assesment.title,
            // questions: assesment.questions
          }))
        },
        
      },
      include: {
        materials: true,
        assessments: true,
      }
    });

    return duplicatedTraining
  }
  

  
  
};
