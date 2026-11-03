import handler from "vinext/server/fetch-handler";
import { handleContact } from "../server/contact.mjs";
const worker = {
  fetch(request: Request, env: Record<string, string>, ctx: ExecutionContext) {
    if (new URL(request.url).pathname.replace(/\/$/, "") === "/api/contact") return handleContact(request, env);
    return handler.fetch(request, env, ctx);
  },
};
export default worker;
