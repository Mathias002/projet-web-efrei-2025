import { MessagesService } from './messages.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { SendMessageInput } from './dto/send-message.input';
import { EditMessageInput } from './dto/edit-message.input';

describe('MessagesService', () => {
  let service: MessagesService;
  let prisma: {
    message: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    conversation: {
      findUnique: jest.Mock;
      update: jest.Mock;
    };
    user: {
      findUnique: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      message: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      conversation: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    };

    service = new MessagesService(prisma as unknown as PrismaService);
  });

  describe('findByConversationId', () => {
    it('should return all messages for a conversation', async () => {
      prisma.message.findMany.mockResolvedValueOnce([
        { id: 'msg1', content: 'Hello', createdAt: new Date() },
      ]);

      const result = await service.findByConversationId('conv1');

      expect(prisma.message.findMany).toHaveBeenCalledWith({
        where: { conversationId: 'conv1', deleted: null },
        orderBy: { createdAt: 'asc' },
      });

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('findById', () => {
    it('should return a message if found', async () => {
      prisma.message.findUnique.mockResolvedValueOnce({ id: 'msg1', content: 'Hello' });

      const result = await service.findById('msg1');

      expect(result).toBeTruthy();
      expect(result?.id).toBe('msg1');
    });

    it('should return null if not found', async () => {
      prisma.message.findUnique.mockResolvedValueOnce(null);

      const result = await service.findById('does-not-exist');

      expect(result).toBeNull();
    });
  });

  describe('send', () => {
    const input: SendMessageInput = {
      content: 'Hi there!',
      senderId: 'user1',
      conversationId: 'conv1',
    };

    it('should send message if conversation and sender exist and user is participant', async () => {
      prisma.conversation.findUnique.mockResolvedValueOnce({
        id: 'conv1',
        participantLinks: [{ userId: 'user1' }],
      });
      prisma.user.findUnique.mockResolvedValueOnce({ id: 'user1' });
      prisma.message.create.mockResolvedValueOnce({ id: 'msg1', content: input.content, createdAt: new Date() });
      prisma.conversation.update.mockResolvedValueOnce({});

      const result = await service.send(input);

      expect(result).toBeTruthy();
      expect(prisma.message.create).toHaveBeenCalled();
    });

    it('should throw if conversation does not exist', async () => {
      prisma.conversation.findUnique.mockResolvedValueOnce(null);

      await expect(service.send(input)).rejects.toThrow('Conversation not found');
    });

    it('should throw if sender does not exist', async () => {
      prisma.conversation.findUnique.mockResolvedValueOnce({ participantLinks: [] });
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.send(input)).rejects.toThrow('Sender not found');
    });

    it('should throw if sender is not a participant', async () => {
      prisma.conversation.findUnique.mockResolvedValueOnce({
        participantLinks: [{ userId: 'someone-else' }],
      });
      prisma.user.findUnique.mockResolvedValueOnce({ id: 'user1' });

      await expect(service.send(input)).rejects.toThrow('Sender is not a participant in this conversation');
    });
  });

  describe('editMessage', () => {
    const input: EditMessageInput = {
      messageId: 'msg1',
      newContent: 'Updated',
    };

    it('should edit message if sender matches', async () => {
      prisma.message.findUnique.mockResolvedValueOnce({ id: 'msg1', senderId: 'user1' });
      prisma.message.update.mockResolvedValueOnce({ id: 'msg1', content: input.newContent });

      const result = await service.editMessage(input, 'user1');

      expect(result).toBeTruthy();
      expect(result.content).toBe('Updated');
    });

    it('should throw if message not found', async () => {
      prisma.message.findUnique.mockResolvedValueOnce(null);

      await expect(service.editMessage(input, 'user1')).rejects.toThrow('Message not found.');
    });

    it('should throw if user is not the sender', async () => {
      prisma.message.findUnique.mockResolvedValueOnce({ id: 'msg1', senderId: 'anotherUser' });

      await expect(service.editMessage(input, 'user1')).rejects.toThrow('Unauthorized to edit this message.');
    });
  });

  describe('deleteMessage', () => {
    it('should soft delete a message if user is the sender', async () => {
      prisma.message.findUnique.mockResolvedValueOnce({ id: 'msg1', senderId: 'user1' });
      prisma.message.update.mockResolvedValueOnce({ id: 'msg1', deleted: new Date() });

      const result = await service.deleteMessage('msg1', 'user1');

      expect(result).toBeTruthy();
      expect(prisma.message.update).toHaveBeenCalled();
    });

    it('should throw if message not found', async () => {
      prisma.message.findUnique.mockResolvedValueOnce(null);

      await expect(service.deleteMessage('msg1', 'user1')).rejects.toThrow('Message not found.');
    });

    it('should throw if user is not the sender', async () => {
      prisma.message.findUnique.mockResolvedValueOnce({ id: 'msg1', senderId: 'otherUser' });

      await expect(service.deleteMessage('msg1', 'user1')).rejects.toThrow('Unauthorized to delete this message.');
    });
  });
});
