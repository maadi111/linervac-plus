// Minimal typings for the parts of paho-mqtt this app uses (the package ships none).
declare module "paho-mqtt" {
  export class Message {
    constructor(payload: string)
    destinationName: string
    readonly payloadString: string
  }

  export interface ConnectOptions {
    timeout?: number
    keepAliveInterval?: number
    cleanSession?: boolean
    useSSL?: boolean
    userName?: string
    password?: string
    onSuccess?: () => void
    onFailure?: (error: Error) => void
  }

  export class Client {
    constructor(host: string, port: number, path: string, clientId: string)
    onConnectionLost: (responseObject: { errorCode?: number; errorMessage?: string }) => void
    onMessageArrived: (message: Message) => void
    connect(options?: ConnectOptions): void
    disconnect(): void
    isConnected(): boolean
    subscribe(filter: string): void
    unsubscribe(filter: string): void
    send(message: Message): void
  }
}
