import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { QueueService } from '../../queue/queue.service';
import { SendMessageInput } from './dto/send-message.input';
import { EditMessageInput } from './dto/edit-message.input';
import { MessageQueuePayload } from 'src/queue/interfaces/queue.interfaces';
import { mockDeep } from 'jest-mock-extended';

const mockPrisma = mockDeep<PrismaService>();
const mockQueue = mockDeep<QueueService>();

const exampleMessage = {
  id: 'msg-123',
  content: 'Hello world',
  senderId: 'user-1',
  conversationId: 'conv-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  deleted: null,
};

// Helper function to create complete message objects
const createMockMessage = (overrides: Partial<typeof exampleMessage> = {}) => ({
  id: 'msg-123',
  content: 'Hello world',
  senderId: 'user-1',
  conversationId: 'conv-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  deleted: null,
  ...overrides,
});

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: QueueService, useValue: mockQueue },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should send a message via queue', async () => {
    const input: SendMessageInput = {
      content: 'Hello',
      senderId: 'user-1',
      conversationId: 'conv-1',
    };

    await service.send(input);

    expect(mockQueue.publishMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Hello',
        senderId: 'user-1',
        conversationId: 'conv-1',
      })
    );
  });

  it('should handle queue message', async () => {
    const payload: MessageQueuePayload = {
      tempId: 'temp-1',
      content: 'Hi',
      senderId: 'user-1',
      conversationId: 'conv-1',
      timestamp: new Date(),
    };

    mockPrisma.conversation.findUnique.mockResolvedValue({
      id: 'conv-1',
      participantLinks: [{ userId: 'user-1' }],
    } as any);
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' } as any);
    mockPrisma.message.create.mockResolvedValue(exampleMessage);
    mockPrisma.conversation.update.mockResolvedValue({} as any);

    const result = await service.handleQueueMessage(payload);

    expect(result).toMatchObject({
      content: 'Hello world',
    });
  });

  it('should throw if message not found on edit', async () => {
    mockPrisma.message.findUnique.mockResolvedValue(null);

    await expect(
      service.editMessage({ messageId: '1', newContent: 'New' }, 'user-1')
    ).rejects.toThrow('Message not found.');
  });

  it('should throw if unauthorized to edit', async () => {
    // Use the helper function to create a complete message object
    mockPrisma.message.findUnique.mockResolvedValue(
      createMockMessage({ senderId: 'user-2' })
    );

    await expect(
      service.editMessage({ messageId: '1', newContent: 'New' }, 'user-1')
    ).rejects.toThrow('Unauthorized to edit this message.');
  });

  it('should edit message content', async () => {
    // Use the helper function to create a complete message object
    mockPrisma.message.findUnique.mockResolvedValue(
      createMockMessage({ senderId: 'user-1' })
    );
    mockPrisma.message.update.mockResolvedValue(exampleMessage);

    const result = await service.editMessage(
      { messageId: '1', newContent: 'Updated' },
      'user-1'
    );

    expect(result).toMatchObject({ content: 'Hello world' });
  });

  it('should delete a message', async () => {
    // Use the helper function to create a complete message object
    mockPrisma.message.findUnique.mockResolvedValue(
      createMockMessage({ senderId: 'user-1' })
    );
    mockPrisma.message.update.mockResolvedValue(exampleMessage);

    const result = await service.deleteMessage('1', 'user-1');

    expect(result).toBeDefined();
    expect(result.id).toBe('msg-123');
  });
});