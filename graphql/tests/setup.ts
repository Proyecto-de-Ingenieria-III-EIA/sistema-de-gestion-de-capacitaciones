import { Context } from '@/types';

export const setupTestData = async (context: Context) => {
  const { db } = context;
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

  // Create a test training session
  await db.training.create({
    data: {
      id: 'training123',
      title: 'AI Fundamentals',
      description: 'Learn AI basics',
      instructorId: instructor.id,
    },
  });
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
};

export const cleanupTestData = async ({ db }: Context) => {
  await db.comment.deleteMany({});
  await db.forumPost.deleteMany({});
  await db.trainingMaterial.deleteMany({});
  await db.training.deleteMany({});
  await db.user.deleteMany({});
  await db.$disconnect();
};
