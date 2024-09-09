import { SlashCommand } from "../../index.js";
import { stripImages } from "../../llm/images.js";

const ComponentMessageCommand: SlashCommand = {
  name: "component",
  description: "Generate a component using v0",
  run: async function* ({ llm, input }) {
    if (input.trim() === "") {
      yield "Please provide a description of the React component you want to generate. For example, '/component Create a dashboard with a user table'.";
      return;
    }

    const gen = `The user has requested to generate a React UI component using the following prompt:

"${input}"

Expand on the prompt to add more detail with bullet points. Do not include the command /component. Do not add information about styles (Material UI, bootstrap). Only use the template below in your response. The prompt in the markdown link must be properly URL encoded. Include new line encoding %0A. Ensure the bullet points have spaces between the dash and the first word.

Response template:

Sure, I can generate the {Component Name} component with the following details:

- Detail #1
- Detail #2

Here is a link to generate this component:

[Capitalised Component Name](https://v0.dev/chat?q={expanded prompt})

You must be signed in with Vercel to generate this component.
												 `;
    for await (const chunk of llm.streamChat([
      { role: "user", content: gen },
    ])) {
      yield stripImages(chunk.content);
    }
  },
};

export default ComponentMessageCommand;
