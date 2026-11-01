/*
 * EthioPrep MongoDB schema.
 * Run from mongosh against the ethioprep database:
 *   mongosh "mongodb://localhost:27017/ethioprep" mongodb-schema.js
 */

const common = {
  createdAt: { bsonType: "date" },
  updatedAt: { bsonType: "date" }
};

function collection(name, required, properties, indexes) {
  const validator = {
    $jsonSchema: {
      bsonType: "object",
      required,
      properties: { ...properties, ...common }
    }
  };
  if (!db.getCollectionNames().includes(name)) {
    db.createCollection(name, {
      validator,
      validationLevel: "strict",
      validationAction: "error"
    });
  } else {
    db.runCommand({
      collMod: name,
      validator,
      validationLevel: "strict",
      validationAction: "error"
    });
  }
  indexes.forEach((index) => db[name].createIndex(index.key, index.options || {}));
}

const id = { bsonType: "objectId" };
const date = { bsonType: "date" };
const text = { bsonType: "string" };

// 1. Authentication and 2. User roles
collection("users", ["email", "displayName", "role", "status", "createdAt", "updatedAt"], {
  email: { bsonType: "string" },
  phoneNumber: text,
  displayName: { bsonType: "string", minLength: 2, maxLength: 120 },
  passwordHash: text,
  role: { enum: ["student", "cash_manager", "content_manager", "admin"] },
  status: { enum: ["pending", "active", "suspended", "deleted"] },
  profile: {
    bsonType: "object",
    properties: {
      school: text,
      grade: text,
      region: text,
      preferredLanguage: { enum: ["en", "am", "om", "ti"] }
    }
  },
  refreshTokens: { bsonType: "array", items: { bsonType: "object" } },
  lastLoginAt: date
}, [
  { key: { email: 1 }, options: { unique: true } },
  { key: { phoneNumber: 1 }, options: { unique: true, sparse: true } },
  { key: { role: 1, status: 1 } }
]);

// 3. Question bank
collection("subjects", ["name", "slug", "status", "createdAt", "updatedAt"], {
  name: text,
  slug: { bsonType: "string", pattern: "^[a-z0-9-]+$" },
  description: text,
  order: { bsonType: "int", minimum: 0 },
  status: { enum: ["draft", "published", "archived"] },
  isPremium: { bsonType: "bool" },
  createdBy: id
}, [
  { key: { slug: 1 }, options: { unique: true } },
  { key: { status: 1, order: 1 } }
]);

collection("chapters", ["subjectId", "title", "slug", "order", "status", "createdAt", "updatedAt"], {
  subjectId: id,
  title: text,
  slug: { bsonType: "string", pattern: "^[a-z0-9-]+$" },
  summary: text,
  content: text,
  order: { bsonType: "int", minimum: 0 },
  status: { enum: ["draft", "published", "archived"] },
  isPremium: { bsonType: "bool" }
}, [
  { key: { subjectId: 1, order: 1 } },
  { key: { subjectId: 1, slug: 1 }, options: { unique: true } }
]);

collection("questions", ["subjectId", "chapterId", "type", "prompt", "difficulty", "status", "createdAt", "updatedAt"], {
  subjectId: id,
  chapterId: id,
  type: { enum: ["multiple_choice", "true_false", "numeric", "short_answer"] },
  prompt: text,
  explanation: text,
  options: {
    bsonType: "array",
    items: {
      bsonType: "object",
      required: ["key", "text", "isCorrect"],
      properties: { key: text, text: text, isCorrect: { bsonType: "bool" } }
    }
  },
  answer: { bsonType: ["string", "double", "int", "bool"] },
  difficulty: { enum: ["easy", "medium", "hard"] },
  isPremium: { bsonType: "bool" },
  status: { enum: ["draft", "review", "published", "archived"] },
  tags: { bsonType: "array", items: text },
  createdBy: id,
  reviewedBy: id
}, [
  { key: { subjectId: 1, chapterId: 1, status: 1, difficulty: 1 } },
  { key: { tags: 1 } }
]);

// 4. Notes module: student notes are separate from editorial chapter content.
collection("notes", ["userId", "title", "body", "status", "createdAt", "updatedAt"], {
  userId: id,
  title: { bsonType: "string", minLength: 1, maxLength: 200 },
  body: text,
  subjectId: id,
  chapterId: id,
  questionId: id,
  color: text,
  status: { enum: ["active", "archived", "deleted"] },
  localId: text,
  syncVersion: { bsonType: "long", minimum: 0 },
  lastSyncedAt: date
}, [
  { key: { userId: 1, status: 1, updatedAt: -1 } },
  { key: { userId: 1, localId: 1 }, options: { unique: true, sparse: true } },
  { key: { userId: 1, chapterId: 1 } }
]);

// 5. Mock exams and attempts
collection("exams", ["title", "questionIds", "durationMinutes", "accessLevel", "status", "createdAt", "updatedAt"], {
  title: text,
  description: text,
  type: { enum: ["practice", "mock_exam", "entrance_exam"] },
  subjectIds: { bsonType: "array", items: id },
  questionIds: { bsonType: "array", minItems: 1, items: id },
  durationMinutes: { bsonType: "int", minimum: 1 },
  passingScore: { bsonType: ["int", "double"], minimum: 0, maximum: 100 },
  accessLevel: { enum: ["free", "premium"] },
  status: { enum: ["draft", "published", "archived"] },
  randomizeQuestions: { bsonType: "bool" },
  randomizeOptions: { bsonType: "bool" },
  createdBy: id
}, [
  { key: { status: 1, accessLevel: 1, type: 1 } },
  { key: { createdAt: -1 } }
]);

collection("examAttempts", ["userId", "examId", "status", "startedAt", "answers", "createdAt", "updatedAt"], {
  userId: id,
  examId: id,
  status: { enum: ["in_progress", "submitted", "expired", "abandoned"] },
  startedAt: date,
  submittedAt: date,
  score: { bsonType: ["int", "double"], minimum: 0 },
  percentage: { bsonType: ["int", "double"], minimum: 0, maximum: 100 },
  passed: { bsonType: "bool" },
  answers: { bsonType: "array", items: { bsonType: "object" } },
  deviceId: text,
  localId: text
}, [
  { key: { userId: 1, examId: 1, createdAt: -1 } },
  { key: { userId: 1, status: 1, updatedAt: -1 } }
]);

// 6. Offline SQLite synchronization support.
// The mobile SQLite database stores the same logical IDs and queues mutations
// in an outbox. MongoDB stores the idempotency key and server change sequence.
collection("syncChanges", ["userId", "deviceId", "operation", "entity", "entityId", "clientMutationId", "createdAt"], {
  userId: id,
  deviceId: text,
  operation: { enum: ["create", "update", "delete"] },
  entity: { enum: ["note", "bookmark", "progress", "examAttempt"] },
  entityId: id,
  clientMutationId: text,
  payload: { bsonType: "object" },
  appliedAt: date,
  error: text
}, [
  { key: { clientMutationId: 1 }, options: { unique: true } },
  { key: { userId: 1, deviceId: 1, createdAt: 1 } },
  { key: { entity: 1, entityId: 1, createdAt: -1 } }
]);

collection("learningProgress", ["userId", "contentType", "contentId", "progressPercent", "updatedAt"], {
  userId: id,
  contentType: { enum: ["subject", "chapter", "question", "exam"] },
  contentId: id,
  progressPercent: { bsonType: ["int", "double"], minimum: 0, maximum: 100 },
  completed: { bsonType: "bool" },
  timeSpentSeconds: { bsonType: "int", minimum: 0 },
  lastAccessedAt: date,
  localUpdatedAt: date
}, [
  { key: { userId: 1, contentType: 1, contentId: 1 }, options: { unique: true } },
  { key: { userId: 1, updatedAt: -1 } }
]);

// 7. Payment verification and 8. Cash manager dashboard
collection("payments", ["userId", "amount", "currency", "provider", "status", "submittedAt", "createdAt", "updatedAt"], {
  userId: id,
  amount: { bsonType: ["int", "double", "decimal"], minimum: 0 },
  currency: { bsonType: "string", pattern: "^[A-Z]{3}$" },
  provider: { enum: ["telebirr", "chapa", "bank_transfer", "cash"] },
  transactionReference: text,
  receiptUrl: text,
  status: { enum: ["pending", "verified", "rejected", "refunded"] },
  reviewedBy: id,
  reviewNote: text,
  submittedAt: date,
  reviewedAt: date
}, [
  { key: { transactionReference: 1 }, options: { unique: true, sparse: true } },
  { key: { status: 1, submittedAt: 1 } },
  { key: { userId: 1, status: 1, submittedAt: -1 } }
]);

collection("cashTransactions", ["paymentId", "cashManagerId", "action", "amount", "createdAt", "updatedAt"], {
  paymentId: id,
  cashManagerId: id,
  action: { enum: ["received", "verified", "rejected", "refunded", "adjusted"] },
  amount: { bsonType: ["int", "double", "decimal"], minimum: 0 },
  note: text,
  balanceAfter: { bsonType: ["int", "double", "decimal"] },
  reference: text
}, [
  { key: { cashManagerId: 1, createdAt: -1 } },
  { key: { paymentId: 1, createdAt: -1 } }
]);

collection("subscriptions", ["userId", "plan", "status", "startsAt", "endsAt", "createdAt", "updatedAt"], {
  userId: id,
  plan: { enum: ["monthly", "quarterly", "annual", "lifetime"] },
  status: { enum: ["pending", "active", "expired", "cancelled", "rejected"] },
  amount: { bsonType: ["int", "double", "decimal"], minimum: 0 },
  currency: { bsonType: "string", pattern: "^[A-Z]{3}$" },
  startsAt: date,
  endsAt: date,
  paymentId: id
}, [
  { key: { userId: 1, status: 1, endsAt: -1 } },
  { key: { endsAt: 1 } }
]);

// 9. Analytics: immutable event stream plus daily aggregates for dashboards.
collection("analyticsEvents", ["userId", "eventName", "occurredAt", "createdAt"], {
  userId: id,
  deviceId: text,
  sessionId: text,
  eventName: text,
  entityType: text,
  entityId: id,
  properties: { bsonType: "object" },
  occurredAt: date,
  appVersion: text,
  platform: { enum: ["android", "ios", "web"] }
}, [
  { key: { userId: 1, occurredAt: -1 } },
  { key: { eventName: 1, occurredAt: -1 } },
  { key: { occurredAt: 1 }, options: { expireAfterSeconds: 63072000 } }
]);

collection("analyticsDaily", ["date", "metric", "dimensions", "value", "createdAt", "updatedAt"], {
  date: { bsonType: "date" },
  metric: text,
  dimensions: { bsonType: "object" },
  value: { bsonType: ["int", "long", "double", "decimal"] },
  uniqueUsers: { bsonType: "long", minimum: 0 },
  metadata: { bsonType: "object" }
}, [
  { key: { date: 1, metric: 1, dimensions: 1 }, options: { unique: true } },
  { key: { metric: 1, date: -1 } }
]);

// 10. Deployment/runtime configuration (secrets must remain in a secret store).
collection("appConfig", ["key", "environment", "value", "updatedBy", "createdAt", "updatedAt"], {
  key: { bsonType: "string", pattern: "^[A-Z0-9_.-]+$" },
  environment: { enum: ["development", "staging", "production"] },
  value: text,
  isSecretReference: { bsonType: "bool" },
  updatedBy: id
}, [
  { key: { environment: 1, key: 1 }, options: { unique: true } }
]);

collection("auditLogs", ["actorId", "action", "resourceType", "resourceId", "createdAt", "updatedAt"], {
  actorId: id,
  action: text,
  resourceType: text,
  resourceId: id,
  changes: { bsonType: "object" },
  ipAddress: text
}, [
  { key: { resourceType: 1, resourceId: 1, createdAt: -1 } },
  { key: { actorId: 1, createdAt: -1 } },
  { key: { createdAt: 1 }, options: { expireAfterSeconds: 63072000 } }
]);

print("EthioPrep MongoDB schema configured successfully.");
