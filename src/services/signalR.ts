import {
  HubConnection,
  HubConnectionState,
  HubConnectionBuilder,
  LogLevel,
  IHttpConnectionOptions,
} from '@microsoft/signalr';
import { isDevelopment } from '_helpers';
import { IMessageProps } from 'models';

const startSignalRConnection = async (connection: HubConnection) => {
  try {
    await connection.start();
    console.assert(connection.state === HubConnectionState.Connected);
    if (isDevelopment) console.log('SignalR connection established');
  } catch (err) {
    console.assert(connection.state === HubConnectionState.Disconnected);

    if (isDevelopment) console.error('SignalR Connection Error: ', err);
    const retryTimeout = 30 * 60 * 1000;
    setTimeout(() => startSignalRConnection(connection), retryTimeout);
  }
};

// Set up a SignalR connection to the specified hub URL, and actionEventMap.
// actionEventMap should be an object mapping event names, to eventHandlers that will
// be dispatched with the message body.
export const setupSignalRConnection = (
  methodName: string,
  url: string,
  eventHandler: (message: IMessageProps) => void
): HubConnection => {
  const options: IHttpConnectionOptions = {
    logMessageContent: isDevelopment,
    logger: isDevelopment ? LogLevel.Warning : LogLevel.Error,
    withCredentials: false,
  };
  // create the connection instance
  // withAutomaticReconnect will automatically try to reconnect
  // and generate a new socket connection if needed
  const connection = new HubConnectionBuilder()
    .withUrl(url, options)
    .withAutomaticReconnect([10000, 5000, 10000, 30000, 60000])
    .configureLogging(isDevelopment ? LogLevel.Warning : LogLevel.Error)
    .build();

  // Note: to keep the connection open the serverTimeout should be
  // larger than the KeepAlive value that is set on the server
  // keepAliveIntervalInMilliseconds default is 15000 and we are using default
  // serverTimeoutInMilliseconds default is 30000 and we are using 60000 set below
  connection.serverTimeoutInMilliseconds = 60000;
  connection.onclose((error: any) => {
    console.assert(connection.state === HubConnectionState.Disconnected);
    if (isDevelopment)
      console.log(
        'Connection closed due to error. Try refreshing this page to restart the connection',
        error
      );
  });
  connection.onreconnecting((error: any) => {
    console.assert(connection.state === HubConnectionState.Reconnecting);
    if (isDevelopment) console.log('Connection lost due to error. Reconnecting.', error);
  });
  connection.onreconnected((connectionId: any) => {
    console.assert(connection.state === HubConnectionState.Connected);
    if (isDevelopment)
      console.log('Connection reestablished. Connected with connectionId', connectionId);
  });

  startSignalRConnection(connection);
  connection.on(methodName, (message: IMessageProps) => {
    eventHandler(message);
  });

  return connection;
};
