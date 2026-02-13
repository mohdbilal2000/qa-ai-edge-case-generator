
import { GoogleGenAI, Type } from "@google/genai";
import { TestCase, GeneratorParams } from "../types";

export const generateTestScenarios = async (params: GeneratorParams): Promise<TestCase[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are a Principal Software Development Engineer in Test (SDET). 
  Your job is not just to check input fields, but to stress-test the entire system architecture.
  You think in terms of:
  1. DISTRIBUTED SYSTEMS (Latency, Timeouts, Race Conditions)
  2. API CONTRACTS (Headers, Auth, Status Codes)
  3. BUSINESS LOGIC (Impossible states, Workflow violations)
  4. DATA INTEGRITY (Database commits, Rollbacks)
  
  You do not write "happy path" tests. You write destructive tests that reveal architectural weaknesses.`;

  const prompt = `Generate a comprehensive QA Test Matrix for the following feature:
  
  **Feature:** ${params.featureName}
  **Platform:** ${params.platform}
  **Context:** ${params.context}
  
  **REQUIRED TEST CATEGORIES (Must cover all):**
  1. 🛡️ **Security & Input**: SQLi, XSS, Overflow, Nulls, Special Chars.
  2. 🌐 **API & Network**: 
     - Handling HTTP 429 (Rate Limit), 500 (Server Error), 503 (Service Unavailable).
     - Slow network simulation (latency) & Request Timeouts.
     - Malformed JSON payloads & Invalid Auth Tokens.
  3. ⚡ **Concurrency & State**:
     - Race Conditions (e.g., Double clicking Submit).
     - Idempotency (Replaying the same API request).
     - Session Expiry handling during the flow.
  4. 💼 **Business Logic & Edge Cases**:
     - "Impossible" logic (e.g., Start Date > End Date, Negative Price).
     - User Role violations (e.g., 'Viewer' trying to 'Edit').
  5. 💾 **Data & Limits**:
     - Max payload size limits.
     - Emoji/Unicode storage verification.
  
  Return a structured JSON list of test cases including category, severity (Critical, High, Medium, Low), description, specific test data or action, and technical expected result.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, description: "One of the required test categories." },
              severity: { type: Type.STRING, enum: ["Critical", "High", "Medium", "Low"] },
              description: { type: Type.STRING, description: "Destructive scenario description." },
              testData: { type: Type.STRING, description: "Specific payload, input, or system state to simulate." },
              expectedResult: { type: Type.STRING, description: "How the system should gracefully fail or protect itself." }
            },
            required: ["category", "severity", "description", "testData", "expectedResult"]
          }
        },
        thinkingConfig: { thinkingBudget: 6000 }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text) as TestCase[];
  } catch (error) {
    console.error("Error generating v2.0 scenarios:", error);
    throw error;
  }
};
