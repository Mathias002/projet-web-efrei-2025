import { ConversationsService } from './conversations.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateConversationInput } from './dto/create-conversation.input';

jest.mock('../../../prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
    },
    conversation: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    message: {
      create: jest.fn(),
    },
    conversationParticipant: {
      createMany: jest.fn(),
    },
  })),
}));

describe('ConversationsService', () => {
  let service: ConversationsService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
    };
    conversation: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
    };
    message: {
      create: jest.Mock;
    };
    conversationParticipant: {
      createMany: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
      conversation: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      message: {
        create: jest.fn(),
      },
      conversationParticipant: {
        createMany: jest.fn(),
      },
    };

    service = new ConversationsService(prisma as unknown as PrismaService);
  });

  describe('findByUserId', () => {
    it('should return mapped conversations for a user', async () => {
      prisma.conversation.findMany.mockResolvedValueOnce([{ id: '1', participantLinks: [], messages: [] }]);

      const result = await service.findByUserId('user1');

      expect(prisma.conversation.findMany).toHaveBeenCalledWith({
        where: {
          participantLinks: {
            some: {
              userId: 'user1',
            },
          },
        },
        include: {
          participantLinks: { include: { user: true } },
          messages: true,
        },
      });

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('findById', () => {
    it('should return mapped conversation if found', async () => {
      prisma.conversation.findUnique.mockResolvedValueOnce({ id: '1', participantLinks: [], messages: [] });

      const result = await service.findById('1');

      expect(prisma.conversation.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          participantLinks: { include: { user: true } },
          messages: true,
        },
      });

      expect(result).toBeTruthy();
    });

    it('should return null if conversation not found', async () => {
      prisma.conversation.findUnique.mockResolvedValueOnce(null);

      const result = await service.findById('does-not-exist');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    const input: CreateConversationInput = {
      participantId: 'user2',
      initialMessage: 'Hello!',
    };

    it('should throw error if creator or participant not found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(input, 'user1')).rejects.toThrow('Creator or participant not found');
    });

    it('should return existing conversation if already exists', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ id: 'user1' }); // creator
      prisma.user.findUnique.mockResolvedValueOnce({ id: 'user2' }); // participant

      prisma.conversation.findFirst.mockResolvedValueOnce({
        id: 'existing',
        participantLinks: [],
        messages: [],
      });

      const result = await service.create(input, 'user1');

      expect(result).toBeTruthy();
      expect(result.id).toBe('existing');
    });

    it('should create new conversation, message, participants and return full data', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ id: 'user1' }); // creator
      prisma.user.findUnique.mockResolvedValueOnce({ id: 'user2' }); // participant
      prisma.conversation.findFirst.mockResolvedValueOnce(null);

      prisma.conversation.create.mockResolvedValueOnce({ id: 'new-conv' });

      prisma.message.create.mockResolvedValueOnce({}); // ignore message return
      prisma.conversationParticipant.createMany.mockResolvedValueOnce({}); // ignore result

      prisma.conversation.findUnique.mockResolvedValueOnce({
        id: 'new-conv',
        participantLinks: [],
        messages: [],
      });

      const result = await service.create(input, 'user1');

      expect(result).toBeTruthy();
      expect(result.id).toBe('new-conv');
    });

    it('should throw if full conversation load fails', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user1' }); // both calls same
      prisma.conversation.findFirst.mockResolvedValue(null);
      prisma.conversation.create.mockResolvedValue({ id: 'new-conv' });
      prisma.message.create.mockResolvedValue({});
      prisma.conversationParticipant.createMany.mockResolvedValue({});
      prisma.conversation.findUnique.mockResolvedValue(null); // simulate fail

      await expect(service.create(input, 'user1')).rejects.toThrow('Failed to load the created conversation.');
    });
  });
});