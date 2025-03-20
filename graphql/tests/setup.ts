import { Context } from '@/types';
import dotenv from 'dotenv';

delete process.env.DATABASE_URL;
dotenv.config({ path: '.env.test' });
console.log('Using DATABASE_URL:', process.env.DATABASE_URL);

export const setupTestData = async (context: Context) => {
  const { db } = context;

  await db.role.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: 'USER' },
  });

  await db.role.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, name: 'INSTRUCTOR' },
  });


  // Create an instructor
  const instructor = await db.user.create({
    data: {
      id: 'instructor123',
      name: 'Jane Doe',
      email: 'instructor@example.com',
      phone: '0987654321',
      area: 'Teaching',
      image: 'instructor.jpg',
      roleId: 2,
    },
  });

  // Create a test user
  await db.user.create({
    data: {
      id: 'user123',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      area: 'Engineering',
      image: 'profile.jpg',
      roleId: 1,
    },
  });

  await db.user.create({
    data: {
      id: 'user456',
      name: 'Joh Doe',
      email: 'johne@example.com',
      phone: '1234567890',
      area: 'Engineering',
      image: 'profile.jpg',
      roleId: 1,
    },
  });

  await db.user.create({
    data: {
      id: 'instructor456',
      name: 'Alice Smith',
      email: 'instructor2@example.com',
      phone: '0987654321',
      area: 'Teaching',
      image: 'instructor2.jpg',
      roleId: 2,
    }
  });
  

  const training = await db.training.create({
    data: {
      id: 'training123',
      title: 'AI Fundamentals',
      description: 'Learn AI basics',
      instructorId: instructor.id,
    },
  });

  const publicTraining = await context.db.training.create({
    data: {
      id: 'public-training',
      title: 'Public Training',
      description: 'Accessible to everyone',
      isPublic: true,
      instructorId: 'instructor123',
    },
  });

  const privateTraining = await context.db.training.create({
    data: {
      id: 'private-training',
      title: 'Private Training',
      description: 'Requires approval',
      isPublic: false,
      instructorId: 'instructor123',
    },
  });

  await context.db.training.create({
      data: {
        id: 'original-training',
        title: 'Original Training',
        description: 'This is the original training',
        isHidden: false,
        isPublic: true,
        instructor: {
          create: { id: 'instructor789', email: 'instructor5@example.com', name: 'Instructor', roleId: 2 },
        },
        materials: {
          create: [{ fileType: 'PDF', fileUrl: 'https://example.com/material.pdf' }],
        },
        assessments: {
          create: [{ title: 'Assessment 1' }],
        },
      },
      include: { instructor: true, materials: true, assessments: true },
    });

  await context.db.enrollment.create({
    data: {
      trainingId: publicTraining.id,
      userId: 'user456',
      status: 'APPROVED',
    },
  });

  await context.db.enrollment.create({
    data: {
      trainingId: privateTraining.id,
      userId: 'user456',
      status: 'PENDING',
    },
  });


  


  // Create a test training session

  await db.forumPost.create({
    data: {
      id: 'forum123',
      title: 'Sample Forum Post',
      content: 'This is a sample forum post.',
      userId: 'user123',
      trainingId: 'training123',
    },
  });

  // Create a comment
  await db.comment.create({
    data: {
      id: 'comment123',
      content: 'Sample comment',
      userId: 'user123',
      forumPostId: 'forum123',
    },
  });

  await context.db.assessment.create({
    data: {
      id: 'assessment123',
      trainingId: 'training123',
      title: 'Final Exam',
    },
  });


};

export const cleanupTestData = async ({ db }: Context) => {
  await db.comment.deleteMany({});
  await db.forumPost.deleteMany({});
  await db.trainingMaterial.deleteMany({});
  await db.enrollment.deleteMany({});
  await db.training.deleteMany({});
  await db.user.deleteMany({});
  await db.role.deleteMany({});
  await db.$disconnect();
};
