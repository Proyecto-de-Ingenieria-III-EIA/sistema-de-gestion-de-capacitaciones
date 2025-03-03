import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { ApolloServer } from '@apollo/server';
import { resolvers, types as typeDefs } from '../index';
import { setupTestData, cleanupTestData, prisma } from './setup';

let server: ApolloServer;
let trainingId: string;

beforeAll(async () => {
  server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  await setupTestData();

  const training = await prisma.training.findUnique({
    where: { id: 'training123' },
  });
  trainingId = training?.id || '';
});

afterAll(async () => {
  await cleanupTestData();
});

describe('Training Material Mutations', () => {
  it('should create a training material', async () => {
    const mutation = `
      mutation createTrainingMaterial($trainingId: String!, $fileType: String!, $fileUrl: String!) {
        createTrainingMaterial(trainingId: $trainingId, fileType: $fileType, fileUrl: $fileUrl) {
          id
          fileType
          fileUrl
        }
      }
    `;
    const response = await server.executeOperation({
      query: mutation,
      variables: {
        trainingId,
        fileType: 'PDF',
        fileUrl: 'https://example.com/material.pdf',
      },
    });

    expect(
      response.body.kind === 'single' &&
        (
          response.body.singleResult?.data?.createTrainingMaterial as {
            fileType: string;
          }
        ).fileType
    ).toBe('PDF');
  });

  it('should delete a training material', async () => {
    // First, create a training material to delete
    const createResponse = await prisma.trainingMaterial.create({
      data: {
        trainingId,
        fileType: 'PDF',
        fileUrl: 'https://example.com/material.pdf',
      },
    });

    const mutation = `
      mutation deleteTrainingMaterial($id: String!) {
        deleteTrainingMaterial(id: $id)
      }
    `;

    const response = await server.executeOperation({
      query: mutation,
      variables: { id: createResponse.id },
    });

    expect(
      response.body.kind === 'single' &&
        response.body.singleResult?.data?.deleteTrainingMaterial
    ).toBe(true);

    // Verify that the training material was actually deleted
    const material = await prisma.trainingMaterial.findUnique({
      where: { id: createResponse.id },
    });
    expect(material).toBeNull();
  });

  it('should retrieve training materials for a training', async () => {
    // Ensure test data exists
    await prisma.trainingMaterial.createMany({
      data: [
        {
          trainingId,
          fileType: 'PDF',
          fileUrl: 'https://example.com/material1.pdf',
        },
        {
          trainingId,
          fileType: 'Video',
          fileUrl: 'https://example.com/material2.mp4',
        },
      ],
    });

    const query = `
      query getTrainingMaterials($trainingId: String!) {
        getTrainingMaterials(trainingId: $trainingId) {
          id
          fileType
          fileUrl
        }
      }
    `;

    const response = await server.executeOperation({
      query,
      variables: { trainingId },
    });

    expect(response.body.kind).toBe('single');
    const materials =
      response.body.kind === 'single'
        ? (response.body.singleResult?.data?.getTrainingMaterials as {
            fileType: string;
          }[])
        : [];
    expect(materials.length).toBeGreaterThanOrEqual(2);
    expect(
      materials.some((m: { fileType: string }) => m.fileType === 'PDF')
    ).toBe(true);
    expect(
      materials.some((m: { fileType: string }) => m.fileType === 'Video')
    ).toBe(true);
  });

  it('should update a training material', async () => {
    // First, create a training material to update
    const createResponse = await prisma.trainingMaterial.create({
      data: {
        trainingId,
        fileType: 'PDF',
        fileUrl: 'https://example.com/material.pdf',
      },
    });

    const mutation = `
      mutation updateTrainingMaterial($id: String!, $fileType: String, $fileUrl: String) {
        updateTrainingMaterial(id: $id, fileType: $fileType, fileUrl: $fileUrl) {
          id
          fileType
          fileUrl
        }
      }
    `;

    const response = await server.executeOperation({
      query: mutation,
      variables: {
        id: createResponse.id,
        fileType: 'Video',
        fileUrl: 'https://example.com/new-video.mp4',
      },
    });

    expect(response.body.kind).toBe('single');
    const updatedMaterial =
      response.body.kind === 'single'
        ? (response.body.singleResult?.data?.updateTrainingMaterial as {
            fileType: string;
            fileUrl: string;
          })
        : null;
    expect(updatedMaterial?.fileType).toBe('Video');
    expect(updatedMaterial?.fileUrl).toBe('https://example.com/new-video.mp4');
  });
});
