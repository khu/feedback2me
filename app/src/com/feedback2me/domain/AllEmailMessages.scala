package com.feedback2me.domain

import javax.mail.{MessagingException, Message}
import collection.mutable.HashMap
import com.feedback2me.domain.EmailMessages

object AllEmailMessages {
  final val GMAIL_ADDRESS: String = "feedback.recorder@gmail.com"

  var emailMessages: HashMap[String, EmailMessages] =
    new HashMap[String, EmailMessages] {
      override def default(key: String) = new EmailMessages();
    }

  def reset(mails: Array[Message]) {
    clearDB
    for (mail <- mails) {
      try {
        val receiver: String = mail.getRecipients(
          Message.RecipientType.TO)(0)
          .asInstanceOf[javax.mail.internet.InternetAddress]
          .getAddress;
        val messages = lookUp(receiver).add(mail)
        emailMessages += (receiver -> messages);
      } catch {
        case e: MessagingException => {
          e.printStackTrace
        }
      }
    }
  }

  def lookUp(receiver: String) = {
    try {
      emailMessages(receiver)
    } catch {
      case e: Exception => {
        new EmailMessages
      }
    }

  }

  private def clearDB {
    emailMessages = new HashMap[String, EmailMessages]()
  }
}