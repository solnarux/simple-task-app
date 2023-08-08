import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateTaskDto, EditTaskDto } from 'src/task/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.CleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@gmail.com',
      password: 'test123',
    };

    describe('SignUp', () => {
      it('should fail to signup if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: 'test123' })
          .expectStatus(400);
      });

      it('should fail to signup if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: 'test@gmail' })
          .expectStatus(400);
      });

      it('should fail to signup if body empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('LogIn', () => {
      it('should fail to login if email empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ password: 'test123' })
          .expectStatus(400);
      });

      it('should fail to login if password empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: 'test@gmail' })
          .expectStatus(400);
      });

      it('should fail to login if body empty', () => {
        return pactum.spec().post('/auth/login').withBody({}).expectStatus(400);
      });

      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Testing',
          email: 'testing@gmail.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.firstName);
      });
    });

    describe('Delete user', () => {});
  });

  describe('Tasks', () => {
    describe('Get empty tasks', () => {
      it("should get empty tasks", () => {
        return pactum
          .spec()
          .get('/tasks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBody([])
      })
    });

    describe('Create task', () => {
      const dto: CreateTaskDto = {
        title: 'Test task',
        description: 'Test description',
        date: new Date(),
      }

      it("should create task", () => {
        return pactum
          .spec()
          .post('/tasks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(201)
          .stores('taskId', 'id')
      })
    });

    describe('Get tasks', () => {
      it("should get tasks", () => {
        return pactum
          .spec()
          .get('/tasks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
      })
    });

    describe('Get task by id', () => {
      it("should get task by id", () => {
        return pactum
          .spec()
          .get('/tasks/{id}')
          .withPathParams('id', '$S{taskId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBodyContains('$S{taskId}')
      })
    });

    describe('Edit task', () => {
      const dto: EditTaskDto = {
        title: 'Flight to L.A',
        description: 'Nos vamos de paseo',
        completed: true,
      }
      it("should edit task by id", () => {
        return pactum
          .spec()
          .patch('/tasks/{id}')
          .withPathParams('id', '$S{taskId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          .expectBodyContains(dto.completed)
      })
    });

    describe('Delete task', () => {
      it("should get task by id", () => {
        return pactum
          .spec()
          .delete('/tasks/{id}')
          .withPathParams('id', '$S{taskId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(204)
      })
      
      it("should get empty tasks", () => {
        return pactum
          .spec()
          .get('/tasks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBody([])
      })
    });
  });
});
