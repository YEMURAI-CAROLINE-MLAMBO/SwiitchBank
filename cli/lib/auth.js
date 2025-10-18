import fs from 'fs/promises';
import os from 'os';
import path from 'path';

const configDir = path.join(os.homedir(), '.swiitchbank');
const tokenPath = path.join(configDir, 'token');

export async function saveToken(token) {
  try {
    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(tokenPath, token, { mode: 0o600 });
  } catch (error) {
    console.error('Error saving token:', error);
  }
}

export async function getToken() {
  try {
    return await fs.readFile(tokenPath, 'utf-8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    console.error('Error reading token:', error);
    return null;
  }
}

export async function clearToken() {
  try {
    await fs.unlink(tokenPath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Error clearing token:', error);
    }
  }
}