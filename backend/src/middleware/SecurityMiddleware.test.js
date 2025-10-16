import express from 'express';
import request from 'supertest';
import { securityMiddleware } from './SecurityMiddleware.js';

describe('SecurityMiddleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(securityMiddleware);
    app.post('/test', (req, res) => {
      res.status(200).json(req.body);
    });
  });

  it('should sanitize the request body', async () => {
    const dirtyPayload = {
      name: '  <John Doe>  ',
      comment: 'this is a <script> tag'
    };
    const cleanPayload = {
      name: 'John Doe',
      comment: 'this is a script tag'
    };

    const res = await request(app)
      .post('/test')
      .send(dirtyPayload);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(cleanPayload);
  });
});