import { Meteor } from 'meteor/meteor';
import MailReader from '../../mail_reader/MailReader';

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

    messages = messages.concat(...await Promise.all(readPromises));

    reader.close();

    return messages;
  };

  readUnreadMessages().then((messages) => {
    // TODO: Process those messages. Now for the fun part!!
    console.log(`Here are your messages: ${messages}`);
  });


  setTimeout(pollMail, Meteor.settings.pollInterval);
};

Meteor.startup(() => {
  pollMail();
});
