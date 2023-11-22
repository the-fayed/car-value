import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';


const user = {
  name: 'test user',
  email: 'test@email.com',
  password: 'Pa@12345678'
};

describe('Authentication system (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('sign up process', () => {
    it('handles sign up process', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send({
          name: user.name,
          email: user.email,
          password: user.password,
        })
        .expect(201)
        .then((res) => {
          const { email, password, access_token } = res.body;
          expect(email).toEqual('test@email.com');
          expect(password).not.toEqual('Pa@12345678');
          expect(access_token).toBeDefined();
        });
    });

    it('should throw bad request error if email is in use', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send({
          name: user.name,
          email: user.email,
          password: user.password,
        })
        .expect(400)
        .then((res) => {
          const { message, access_token } = res.body;
          expect(message).toContain('Email already in use');
          expect(access_token).toBeUndefined();
        });
    });
  });

  describe('Log in process', () => {
    it('should log in successfully if user exist and password is correct', async () => {
      return request(app.getHttpServer()).post('/api/v1/auth/login').send({
        email: user.email,
        password: user.password,
      }).expect(200).then((res) => {
        const {access_token, password} = res.body;
        expect(access_token).toBeDefined()
        expect(password).toBeUndefined()
      })
    });

    it('should throw a unauthorized error if email dose not exist', async () => {
      return request(app.getHttpServer()).post('/api/v1/auth/login').send({
        email: "invalid@email.com",
        password: user.password,
      }).expect(401).then((res) => {
        const {message} = res.body;
        expect(message).toContain("User not found, please sign up first.");
      })
    });

    it('should throw unauthorized error if wrong password', async () => {
      return request(app.getHttpServer()).post('/api/v1/auth/login').send({
        email: user.email,
        password: 'wrong-password'
      }).expect(401).then((res) => {
        const {message} = res.body;
        expect(message).toContain('Invalid email or password');
      })
    });
  });
});
