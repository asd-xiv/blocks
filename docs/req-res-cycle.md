[`mermaid`](https://github.com/knsv/mermaid) sequence diagram. Use [`mermaid-live-editor`](https://mermaidjs.github.io/mermaid-live-editor) to visualize.

```
sequenceDiagram
    participant Client
    participant JSONSchema
    participant Permission
    participant Route logic

    Client ->>+ JSONSchema: I have some data
    JSONSchema --X- Client: 409: `drop_table` not allowed

    JSONSchema ->>+ Permission: Data is valid
    Permission --X- Client: 403: YOU SHALL NOT PASS!

    Permission ->>+ Route logic: Data is valid and allowed
    Route logic ->>- Client: 200: I'll take that data and give you other data
```

