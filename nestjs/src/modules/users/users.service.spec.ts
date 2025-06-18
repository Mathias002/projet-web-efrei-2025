import { UsersService } from './users.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { EditUserInput } from './dto/edit-user.input';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    service = new UsersService(prisma as unknown as PrismaService);
  });

  describe('findAll', () => {
    it('should return all non-deleted users', async () => {
      prisma.user.findMany.mockResolvedValueOnce([
        { id: '1', email: 'a@test.com', username: 'Alice' },
      ]);

      const result = await service.findAll();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { deleted: null },
      });

      expect(result).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ id: '1', email: 'a@test.com', username: 'Alice' });

      const result = await service.findById('1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toBeTruthy();
    });

    it('should throw if user not found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.findById('missing')).rejects.toThrow('Sorry, impossible to find this user.');
    });
  });

  describe('findByIds', () => {
    it('should return users if all found', async () => {
      const userIds = ['1', '2'];
      prisma.user.findMany.mockResolvedValueOnce([
        { id: '1', username: 'Alice' },
        { id: '2', username: 'Bob' },
      ]);

      const result = await service.findByIds(userIds);

      expect(result).toHaveLength(2);
    });

    it('should throw if some users are missing', async () => {
      prisma.user.findMany.mockResolvedValueOnce([{ id: '1' }]); // only 1 found

      await expect(service.findByIds(['1', '2'])).rejects.toThrow(
        'Sorry, impossible to find some of these users. Please try again.',
      );
    });
  });

  describe('createUser', () => {
    const input: CreateUserInput = {
      username: 'Charlie',
      email: 'charlie@test.com',
      password: 'password',
    };

    it('should create a user if email does not exist', async () => {
      prisma.user.findFirst.mockResolvedValueOnce(null);
      prisma.user.create.mockResolvedValueOnce({
        id: 'newId',
        ...input,
      });

      const result = await service.createUser(input);

      expect(result).toBeTruthy();
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: input.username,
          email: input.email,
          password: input.password
        },
      });
    });

    it('should throw if email already exists', async () => {
      prisma.user.findFirst.mockResolvedValueOnce({ id: 'existingId' });

      await expect(service.createUser(input)).rejects.toThrow(
        'A user with the same email adress already exists.',
      );
    });
  });

  describe('editUser', () => {
    const input: EditUserInput = {
      username: 'NewName',
      email: 'newemail@test.com',
    };

    it('should edit user if id exists and email is free', async () => {
      prisma.user.findFirst
        .mockResolvedValueOnce({ id: '1' }) // existing user
        .mockResolvedValueOnce(null); // email not taken

      prisma.user.update.mockResolvedValueOnce({
        id: '1',
        ...input,
      });

      const result = await service.editUser('1', input);

      expect(result).toBeTruthy();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          username: input.username,
          email: input.email,
        },
      });
    });

    it('should throw if user not found', async () => {
      prisma.user.findFirst.mockResolvedValueOnce(null);

      await expect(service.editUser('missing', input)).rejects.toThrow(
        'Sorry, impossible to find this user.',
      );
    });

    it('should throw if email is already used', async () => {
      prisma.user.findFirst
        .mockResolvedValueOnce({ id: '1' }) // existing user
        .mockResolvedValueOnce({ id: '2' }); // existing email used

      await expect(service.editUser('1', input)).rejects.toThrow(
        'A user with the same email adress already exists.',
      );
    });
  });

  describe('deleteUser', () => {
    it('should soft delete the user if found', async () => {
      prisma.user.findFirst.mockResolvedValueOnce({ id: '1' });
      prisma.user.update.mockResolvedValueOnce({
        id: '1',
        deleted: new Date(),
      });

      const result = await service.deleteUser('1');

      expect(prisma.user.update).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });

    it('should throw if user not found', async () => {
      prisma.user.findFirst.mockResolvedValueOnce(null);

      await expect(service.deleteUser('missing')).rejects.toThrow(
        'Sorry, impossible to find this user.',
      );
    });
  });
});
