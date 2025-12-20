import mongoose from 'mongoose';
import * as swiitchSafeService from '../../src/services/swiitchSafeService.js';
import SwiitchSafeDocument from '../../src/models/SwiitchSafeDocument.js';
import User from '../../src/models/User.js';
import fs from 'fs';
import { jest } from '@jest/globals';

describe('SwiitchSafe Service', () => {
  let user;

  beforeAll(async () => {
    // Rely on global setup for connection
    user = new User({
      swiitchBankId: 'test-user-svc-123',
      email: 'testsvc@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'SvcUser'
    });
    await user.save();
  });

  afterAll(async () => {
    await User.deleteMany({ email: 'testsvc@example.com' });
  });

  afterEach(async () => {
    await SwiitchSafeDocument.deleteMany({});
  });

  it('should upload a document', async () => {
    const file = { originalname: 'test.pdf', path: 'uploads/test.pdf', mimetype: 'application/pdf' };
    const ocrText = 'mock ocr text';
    const doc = await swiitchSafeService.uploadDocument(user._id, file, ocrText);

    expect(doc).toBeDefined();
    expect(doc.fileName).toBe('test.pdf');
    expect(doc.user).toEqual(user._id);
    const count = await SwiitchSafeDocument.countDocuments();
    expect(count).toBe(1);
  });

  it('should list documents for a user', async () => {
    await new SwiitchSafeDocument({ user: user._id, fileName: 'doc1.pdf', filePath: 'path1', fileType: 'application/pdf' }).save();
    await new SwiitchSafeDocument({ user: user._id, fileName: 'doc2.jpg', filePath: 'path2', fileType: 'image/jpeg' }).save();

    const documents = await swiitchSafeService.listDocuments(user._id);
    expect(documents).toHaveLength(2);
  });

  it('should get a single document', async () => {
    const doc = await new SwiitchSafeDocument({ user: user._id, fileName: 'single.pdf', filePath: 'path_single', fileType: 'application/pdf' }).save();

    const foundDoc = await swiitchSafeService.getDocument(user._id, doc._id);

    expect(foundDoc).toBeDefined();
    expect(foundDoc.fileName).toBe('single.pdf');
  });

  it('should delete a document and the associated file', async () => {
    const unlinkSpy = jest.spyOn(fs, 'unlink').mockImplementation((path, callback) => callback(null));

    const doc = await new SwiitchSafeDocument({ user: user._id, fileName: 'doc_to_delete.pdf', filePath: 'path_del', fileType: 'application/pdf' }).save();

    await swiitchSafeService.deleteDocument(user._id, doc._id);

    const count = await SwiitchSafeDocument.countDocuments();
    expect(count).toBe(0);
    expect(unlinkSpy).toHaveBeenCalledWith('path_del', expect.any(Function));

    unlinkSpy.mockRestore();
  });
});
