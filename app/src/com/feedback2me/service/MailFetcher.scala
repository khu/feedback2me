package com.feedback2me.service

import javax.mail.Message

trait MailFetcher {
  def connect();

  def fetchEmailsFromFolder(folderName: String): Array[Message];

  def disconnect();

}