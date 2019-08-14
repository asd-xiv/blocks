sequenceDiagram
    participant Client
    participant JSONSchema
    participant Permission
    participant Route logic

    Client ->>+ JSONSchema: Hello! I have data
    JSONSchema --X- Client: 409: `drop_table` not allowed

    JSONSchema ->>+ Permission: Data is valid
    Permission --X- Client: 403: YOU SHALL NOT PASS!

    Permission ->>+ Route logic: Data is allowed and valid
    Route logic ->>- Client: 200: I'll take that data and give you other data in return
