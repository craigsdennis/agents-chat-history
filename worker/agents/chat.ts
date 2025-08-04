import { Agent } from "agents";
import { unstable_callable as callable } from "agents";
import OpenAI from "openai";


export type ChatState = {
    description: string;
}

export class ChatAgent extends Agent<Env, ChatState> {

    onStart() {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        this.sql`CREATE TABLE IF NOT EXISTS responses (
            id text PRIMARY KEY,
            payload text NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`       
    }

    @callable()
    async sendText(text: string) {
        const previousResponseRows = this.sql<{payload: string}>`SELECT payload FROM responses ORDER BY created_at;`;
        const input: OpenAI.Responses.ResponseInputItem[] = previousResponseRows.flatMap((responseRow) => {
            const payload: OpenAI.Responses.Response = JSON.parse(responseRow.payload);
            return payload.output;
        });
        // Add the text from the user
        input.push({role: "user", content: text});

        const openai = new OpenAI({apiKey: this.env.OPENAI_API_KEY});
        const response = await openai.responses.create({
            model: "gpt-4.1",
            input
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        this.sql`INSERT INTO responses (id, payload) VALUES (${response.id}, ${JSON.stringify(response)});`;
        return response.output_text;
    }
}