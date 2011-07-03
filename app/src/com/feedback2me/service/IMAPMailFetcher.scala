package com.feedback2me.service

import com.feedback2me.LogHelper
import javax.mail._

class IMAPMailFetcher(val username: String, val password: String)
  extends MailFetcher with LogHelper {
  var session: Session = null;
  var store: Store = null;
  var folder: Folder = null;

  override def connect() {
    val props = System.getProperties();
    props.setProperty("mail.store.protocol", "imaps");
    session = Session.getDefaultInstance(props, null);
    store = session.getStore("imaps");
    store.connect("imap.gmail.com", username, password);
    logger.info("connected through IMAP");
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