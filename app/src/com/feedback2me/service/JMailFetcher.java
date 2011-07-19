package com.feedback2me.service;

import javax.mail.Message;

public abstract class JMailFetcher {
  abstract void connect();

  abstract Message [] fetchEmailsFromFolder(String folderName);

  abstract void disconnect();
}
