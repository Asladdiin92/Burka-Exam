import test from "node:test";
import assert from "node:assert/strict";
import { chatWithTutor } from "./ai.controller.js";

test("chatWithTutor responds to single query with model and persona", async () => {
  const req = {
    body: {
      message: "What is the speed of light in vacuum?",
      taskType: "fast"
    }
  };
  let result = null;
  const res = {
    json: (data) => { result = data; return res; },
    status: () => res
  };

  await chatWithTutor(req, res);
  assert.ok(result, "Expected response data");
  assert.equal(result.role, "model");
  assert.ok(result.reply && result.reply.length > 5, "Expected non-empty reply");
  assert.ok(result.source, "Expected source model indicator");
});

test("chatWithTutor handles multi-turn conversation history with context", async () => {
  const req = {
    body: {
      messages: [
        { role: "user", text: "What is an ecosystem?" },
        { role: "model", text: "An ecosystem is a community of living organisms interacting with their physical environment." },
        { role: "user", text: "Give two Ethiopian examples." }
      ],
      context: {
        subjectName: "Biology",
        gradeLevel: "Grade 11"
      },
      role: "exam_coach"
    }
  };
  let result = null;
  const res = {
    json: (data) => { result = data; return res; },
    status: () => res
  };

  await chatWithTutor(req, res);
  assert.ok(result, "Expected response data");
  assert.equal(result.role, "model");
  assert.ok(result.reply.length > 10, "Expected detailed reply");
  assert.equal(result.persona, "exam_coach");
});
