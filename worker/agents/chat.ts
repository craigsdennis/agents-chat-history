import { Agent, type Connection } from "agents";
import { unstable_callable as callable } from "agents";
import OpenAI from "openai";

export type ChatState = {
  description: string;
};

export type ChatMessage = {
  id?: string;
  created_at?: number;
  content: string;
  role: "user" | "assistant";
}

export class ChatAgent extends Agent<Env, ChatState> {
  onStart() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.sql`CREATE TABLE IF NOT EXISTS history (
            id text PRIMARY KEY,
            payload text NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`;
  }


  chatHistory({includeCreatedAt = false}: {includeCreatedAt: boolean}): ChatMessage[] {
    const rows = this.sql<{payload: string, created_at: number}>`SELECT payload, created_at FROM history ORDER BY created_at;`;
    return rows.map(row => {
        const message = JSON.parse(row.payload) as ChatMessage;
        if (includeCreatedAt) {
            message.created_at = row.created_at
        }
        return message;
    });
  }

  async onConnect(connection: Connection) {
    connection.send(
      JSON.stringify({
        chatHistory: this.chatHistory({includeCreatedAt: true}),
      })
    );
  }

  @callable()
  async sendText(text: string) {
    // See: https://platform.openai.com/docs/guides/conversation-state?api-mode=responses#manually-manage-conversation-state
    const input = this.chatHistory({includeCreatedAt: false});
    // Add the text from the user
    const userMessage: ChatMessage = { role: "user", content: text };
    input.push(userMessage);

    const openai = new OpenAI({ apiKey: this.env.OPENAI_API_KEY });
    const response = await openai.responses.create({
      model: "gpt-4.1",
      input,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.sql`INSERT INTO history (id, payload) VALUES (${"user-" + crypto.randomUUID()}, ${JSON.stringify(userMessage)})`;

    
    const assistantMessages: ChatMessage[] = response.output
        .filter(o => o.type === "message")
        .map(o => {
            return {
                id: o.id,
                role: o.role,
                content: response.output_text // OpenAI collapses this
            };
        });
    // TODO: Are there multiple `"message"` types allowed in `output`?
    for (const assistantMessage of assistantMessages) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        this.sql`INSERT INTO history (id, payload) VALUES (${
            response.id + "-" + assistantMessage.id
        }, ${JSON.stringify(assistantMessage)});`;
    }

    return response.output_text;
  }
}
