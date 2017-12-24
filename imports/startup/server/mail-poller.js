import { Meteor } from 'meteor/meteor';
import MailReader from '../../mail_reader/MailReader';
import parseMail, { canParse } from '../../parsers/arq-email-parser';
import Results from '../../api/results/results';

const pollMail = () => {
  const {
    settings:
    {
      username, password, host, port, tls,
    },
  } = Meteor;

  const reader = new MailReader(username, password, host, port, tls);

  const readUnreadMessages = async () => {
    await reader.connect();

    let messages = [];

    const readPromises = [];

    Meteor.settings.mailboxes.forEach((mailbox) => {
      readPromises.push(reader.readMessages(mailbox));
    });

    const mailboxPromisesResolved = await Promise.all(readPromises);

    mailboxPromisesResolved.forEach((mailboxPromiseResolved) => {
      messages = messages.concat(...mailboxPromiseResolved);
    });

    reader.close();

    return messages;
  };

  readUnreadMessages().then((messages) => {
    messages.forEach((message) => {
      console.info('Got a new e-mail');
      if (canParse(message.text)) {
        console.info('Arq can parse it. Parsing and inserting.');
        Results.insert(parseMail(message.text));
      }
    });
  });


  setTimeout(pollMail, Meteor.settings.pollInterval);
};

Meteor.startup(() => {
  pollMail();
});
