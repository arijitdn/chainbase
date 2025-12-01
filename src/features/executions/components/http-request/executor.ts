import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import type { NodeExecutor } from "@/features/executions/types";

type HTTPRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HTTPRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  if (!data.variableName) {
    throw new NonRetriableError("Variable name not configured");
  }

  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request Node: No endpoint configured");
  }

  const result = await step.run("http-request", async () => {
    if (!data.endpoint || !data.method) {
      throw new NonRetriableError(
        "HTTP Request Node: Endpoint or method not configured",
      );
    }

    const endpoint = data.endpoint;
    const method = data.method;

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      options.body = data.body;
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("Content-Type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    if (data.variableName) {
      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    }

    return {
      ...context,
      ...responsePayload,
    };
  });

  return result;
};
