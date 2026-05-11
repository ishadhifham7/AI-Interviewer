/**
 * Shared Ollama HTTP client for Gemma 4 local inference.
 *
 * Communicates with the Ollama REST API (default: http://localhost:11434).
 * Used by the interview module and feedback module.
 */

import dotenv from "dotenv";
dotenv.config();

// ── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OllamaGenerateOptions {
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
}

interface OllamaGenerateResponse {
  response: string;
  done: boolean;
}

interface OllamaChatResponse {
  message: { role: string; content: string };
  done: boolean;
}

// ── Client ───────────────────────────────────────────────────────────────────

export class OllamaClient {
  private baseUrl: string;
  private model: string;

  constructor(modelOverride?: string) {
    this.baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    this.model = modelOverride || process.env.OLLAMA_MODEL || "gemma3";
  }

  /**
   * Single-shot text generation.
   * Good for: question generation, answer evaluation, feedback generation.
   */
  public async generate(
    prompt: string,
    options: OllamaGenerateOptions = {},
  ): Promise<string> {
    const url = `${this.baseUrl}/api/generate`;

    const body = {
      model: this.model,
      prompt,
      stream: false,
      options: {
        temperature: options.temperature ?? 0.7,
        top_p: options.top_p ?? 0.9,
        ...(options.max_tokens ? { num_predict: options.max_tokens } : {}),
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw this.buildError(
        `Ollama generate failed (${response.status}): ${errorText}`,
        response.status,
      );
    }

    const data = (await response.json()) as OllamaGenerateResponse;
    return data.response;
  }

  /**
   * Multi-turn chat completion.
   * Good for: adaptive interview conversations with history.
   */
  public async chat(
    messages: ChatMessage[],
    options: OllamaGenerateOptions = {},
  ): Promise<string> {
    const url = `${this.baseUrl}/api/chat`;

    const body = {
      model: this.model,
      messages,
      stream: false,
      options: {
        temperature: options.temperature ?? 0.7,
        top_p: options.top_p ?? 0.9,
        ...(options.max_tokens ? { num_predict: options.max_tokens } : {}),
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw this.buildError(
        `Ollama chat failed (${response.status}): ${errorText}`,
        response.status,
      );
    }

    const data = (await response.json()) as OllamaChatResponse;
    return data.message.content;
  }

  /**
   * Generate embeddings for RAG vector search.
   * Uses the embedding model configured in OLLAMA_EMBED_MODEL.
   */
  public async embed(text: string): Promise<number[]> {
    const url = `${this.baseUrl}/api/embeddings`;
    const embedModel =
      process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: embedModel, prompt: text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw this.buildError(
        `Ollama embed failed (${response.status}): ${errorText}`,
        response.status,
      );
    }

    const data = (await response.json()) as { embedding: number[] };
    return data.embedding;
  }

  /**
   * Health check — verify Ollama is running and model is available.
   */
  public async ping(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) return false;

      const data = (await response.json()) as {
        models: { name: string }[];
      };
      const available = data.models.map((m) => m.name);

      console.log("[OllamaClient] Available models:", available);
      return available.some((name) => name.startsWith(this.model));
    } catch {
      return false;
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  private buildError(message: string, status: number) {
    const err = new Error(message) as Error & { statusCode?: number };

    if (status === 404) {
      err.statusCode = 500;
      err.message = `Ollama model "${this.model}" not found. Run: ollama pull ${this.model}`;
    } else if (status === 0 || message.includes("ECONNREFUSED")) {
      err.statusCode = 503;
      err.message =
        "Cannot reach Ollama server. Make sure it is running: ollama serve";
    } else {
      err.statusCode = 500;
    }

    return err;
  }
}
