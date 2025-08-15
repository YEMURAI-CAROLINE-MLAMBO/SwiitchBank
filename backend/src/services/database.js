const crypto = require('crypto');

// Pure JavaScript in-memory database
class MemoryDatabase {
  constructor() {
    this.tables = {};
    this.indexes = {};
  }

  createTable(tableName, schema) {
    this.tables[tableName] = [];
    this.indexes[tableName] = {};
    schema.indexes?.forEach(index => {
      this.indexes[tableName][index] = new Map();
    });
  }

  insert(tableName, record) {
    if (!this.tables[tableName]) {
      throw new Error(`Table ${tableName} does not exist`);
    }

    const id = crypto.randomUUID();
    const recordWithId = { ...record, id, createdAt: new Date() };
    this.tables[tableName].push(recordWithId);

    // Update indexes
    Object.keys(this.indexes[tableName]).forEach(field => {
      const index = this.indexes[tableName][field];
      const value = record[field];
      if (value) { // only index if value is not null/undefined
        if (!index.has(value)) index.set(value, []);
        index.get(value).push(recordWithId);
      }
    });

    return recordWithId;
  }

  find(tableName, conditions) {
    const records = this.tables[tableName] || [];
    if (Object.keys(conditions).length === 0) {
      return records;
    }
    return records.filter(record => {
      return Object.entries(conditions).every(([key, value]) => {
        return record[key] === value;
      });
    });
  }

  findByIndex(tableName, indexName, value) {
    const index = this.indexes[tableName]?.[indexName];
    return index?.get(value) || [];
  }

  update(tableName, id, updates) {
    const record = this.tables[tableName].find(r => r.id === id);
    if (!record) return null;

    Object.assign(record, updates, { updatedAt: new Date() });
    return record;
  }
}

// Singleton database instance
module.exports = new MemoryDatabase();
