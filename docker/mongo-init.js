// MongoDB initialization script
// This runs when the container is first created

db = db.getSiblingDB('portfolio');

// Create collections with validation
db.createCollection('projects', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'slug', 'description'],
      properties: {
        title: { bsonType: 'string' },
        slug: { bsonType: 'string' },
        description: { bsonType: 'string' },
        technologies: { bsonType: 'array' },
        featured: { bsonType: 'bool' },
        status: { enum: ['draft', 'published', 'archived'] },
      },
    },
  },
});

db.createCollection('skills', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'category'],
      properties: {
        name: { bsonType: 'string' },
        category: { bsonType: 'string' },
        proficiency: { bsonType: 'int', minimum: 0, maximum: 100 },
      },
    },
  },
});

db.createCollection('contactmessages');
db.createCollection('analytics');

// Create indexes for better query performance
db.projects.createIndex({ slug: 1 }, { unique: true });
db.projects.createIndex({ featured: 1 });
db.projects.createIndex({ status: 1 });
db.projects.createIndex({ createdAt: -1 });

db.skills.createIndex({ name: 1 }, { unique: true });
db.skills.createIndex({ category: 1 });

db.contactmessages.createIndex({ createdAt: -1 });
db.contactmessages.createIndex({ status: 1 });

db.analytics.createIndex({ date: -1 });

print('MongoDB initialized with collections and indexes');
