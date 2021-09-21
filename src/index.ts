import { context, Span, trace } from "@opentelemetry/api";
import { NodeTracerProvider } from "@opentelemetry/node";
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor
} from "@opentelemetry/tracing";

// Register the node provider
const provider = new NodeTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register();

const tracer = trace.getTracer("my-app");
const span = tracer.startSpan("root");
console.log(
  "currently active span",
  trace.getSpan(context.active())?.spanContext()
);
const ctx = trace.setSpan(context.active(), span);
console.log("called setSpan and got back a new context");
console.log(
  "currently active span",
  trace.getSpan(context.active())?.spanContext()
);
console.log("span from returned context", trace.getSpan(ctx)?.spanContext());
console.log("now lets set the context as active");
context.with(ctx, () => {
  console.log("inside callback");
  console.log(
    "currently active span",
    trace.getSpan(context.active())?.spanContext()
  );
});
console.log("outside callback");
console.log(
  "currently active span",
  trace.getSpan(context.active())?.spanContext()
);
