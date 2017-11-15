import ImapClient from 'emailjs-imap-client';
import _ from 'lodash';
import { simpleParser } from 'mailparser';

class MailReader {
  constructor(
    username: string,
    password: string,
    host: string,
    port: number = 993,
    tls: boolean = true,
  ) {
    this.client = new ImapClient(
      host, port,
      {
        auth: { user: username, pass: password },
        useSecureTransport: tls,
        enableCompression: true,
      },
    );
  }

  readMessages(mailbox: string) {
    const messagesAsync = async () => {
      const parsedMessages = [];

      try {
        const unreadMessages = await this.client.search(mailbox, { unseen: true }, { byUid: true });

        if (!_.isEmpty(unreadMessages)) {
          const messageDetails = await this.client.listMessages(mailbox, unreadMessages.join(','), ['uid', 'body[]'], { byUid: true });

          const messageDetailsParsed = [];

          messageDetails.forEach((messageDetail) => {
            messageDetailsParsed.push(simpleParser(messageDetail['body[]']));
          });

          parsedMessages.push(await Promise.all(messageDetailsParsed));
        }
      } catch (error) {
        // TODO: Handle better
        console.error(error);
      }

      return parsedMessages;
    };

    return messagesAsync();
  }

  connect() {
    const connectAsync = async () => {
      try {
        await this.client.connect();
      } catch (error) {
        // TODO: Handle better
        console.error(error);
      }
    };

    return connectAsync();
  }

  close() {
    const closeAsync = async () => {
      try {
        await this.client.close();
      } catch (error) {
        // TODO: Handle better
        console.error(error);
      }
    };

    return closeAsync();
  }
}

export default MailReader;
