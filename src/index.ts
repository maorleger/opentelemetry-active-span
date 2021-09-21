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

// start a span just starts a span, but does not set it to active
const tracer = trace.getTracer("my-app");
const span = tracer.startSpan("root");
console.log(
  "currently active span",
  trace.getSpan(context.active())?.spanContext()
);
// setSpan will set the SPAN key on some context, but context.active() is immutable and does not change
// so ctx will have the span we set, but context.active() will not.
const ctx = trace.setSpan(context.active(), span);
console.log("called setSpan and got back a new context");
console.log(
  "currently active span",
  trace.getSpan(context.active())?.spanContext()
);
console.log("span from returned context", trace.getSpan(ctx)?.spanContext());

// context.with is a lower level method that sets the global active context to a value
// Inside the callback you can call context.active() to get this context
console.log("now setting context as active");
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
console.log("next, using startActiveSpan");
// startActiveSpan will do it all except end the span
tracer.startActiveSpan("some span", (span) => {
  console.log("newly created span", span.spanContext());
  console.log(
    "currently active span",
    trace.getSpan(context.active())?.spanContext()
  );
  span.end();
});
