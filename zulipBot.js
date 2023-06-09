import zulipInit from "zulip-js";
import { askllama, init, llamaParams } from "./llama.js";

const config = { zuliprc: "./zuliprc" };
const client = await zulipInit(config);

async function main() {
  let { queue_id, last_event_id } = await client.queues.register({
    event_types: ["message"],
  });

  await init();

  while (42) {
    const { events } = await client.events.retrieve({
      queue_id,
      last_event_id,
    });

    events.forEach(async (event) => {
      last_event_id = Math.max(last_event_id, Number(event.id));
      const isMentioned = event.flags?.includes("mentioned");
      console.log(event);
      if (
        event.type === "message" &&
        event.message.type === "private" &&
        event.message.sender_full_name !== "gptBot"
      ) {
        console.log(event.message);
        const content = await askllama({
          question: `My name is ${event.message.sender_full_name}. Answer this question: ${event.message.content}`,
        });
        console.log(content);
        await client.messages.send({
          to: event.message.sender_email,
          type: "private",
          //type: 'stream',
          subject: "Testing gptBot",
          content: content.replace("(answers the question)", ""),
        });
      }
    });
  }
}

main();
