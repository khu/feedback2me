package com.feedback2me.service

import java.security.Security
import java.util.Properties
import javax.mail._
import com.feedback2me.LogHelper
;

class POP3MailFetcher(val username: String, val password: String) extends MailFetcher with LogHelper {
  var session: Session = null;
  var store: Store = null;
  var folder: Folder = null;

  override def connect() {
    logger.info("started to login into Gmail.")
    Security.addProvider(new com.sun.security.sasl.Provider());

    val SSL_FACTORY = "javax.net.ssl.SSLSocketFactory";
    val pop3Props: Properties = new Properties();

    pop3Props.setProperty("mail.pop3.socketFactory.class", SSL_FACTORY);
    pop3Props.setProperty("mail.pop3.socketFactory.fallback", "false");
    pop3Props.setProperty("mail.pop3.port", "995");
    pop3Props.setProperty("mail.pop3.socketFactory.port", "995");

    session = Session.getInstance(pop3Props, null);

    store = session.getStore("pop3");
    store.connect("pop.gmail.com", 995, username, password);
    logger.info("logged in")
  }

  override def fetchEmailsFromFolder(folderName: String) = {
    folder = store.getFolder(folderName);
    folder.open(Folder.READ_ONLY);

    val count = folder.getMessageCount
    logger.info("totally " + count + " messages are available.");

    val messages: Array[Message] = folder.getMessages();

    val fp: FetchProfile = new FetchProfile();
    fp.add(FetchProfile.Item.ENVELOPE);
    fp.add(FetchProfile.Item.CONTENT_INFO);
    folder.fetch(messages, fp);
    logger.info(messages.size + "messages has been downloadd.");
    messages;
  }

  override def disconnect() {
    folder.close(false);
    store.close();
  }
}