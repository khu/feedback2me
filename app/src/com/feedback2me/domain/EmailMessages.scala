package com.feedback2me.domain

import org.joda.time.DateTime
import com.feedback2me.LogHelper
import javax.mail.internet.{MimeBodyPart, MimeMultipart}
import java.lang.StringBuilder
import java.io.{ByteArrayOutputStream, InputStreamReader, BufferedReader}
import javax.mail._
import java.util.HashSet
import collection.immutable.HashSet

class EmailMessages extends LogHelper {
  var messages = List[EmailMessage]()


  def add(mail: Message) = {
    //    val bo: ByteArrayOutputStream = new ByteArrayOutputStream();
    //    mail.writeTo(bo)
    //    val content = bo.toString
    //    bo.close()
    val content = readContent(mail)
    val emailMessage = new EmailMessage(mail.getFrom()(0).toString,
      mail.getRecipients(Message.RecipientType.TO)(0).toString,
      mail.getSubject,
      content,
      new DateTime(mail.getReceivedDate))
    logger.info("mail " + emailMessage)
    messages = messages.:::(List(emailMessage))
    val emailMessages = new EmailMessages()
    emailMessages.messages = messages;
    emailMessages
  }

  def readContent(mail: Message) = {
    var content = "";
    if (mail.isMimeType("text/plain")) {
      content = mail.getContent().toString();
    } else {
      val mp: Multipart = mail.getContent.asInstanceOf[Multipart]
      val mpCount = mp.getCount();
      for (i <- 0 until mpCount) {
        val part = mp.getBodyPart(i);
        val disposition = part.getDisposition();
        if (disposition != null && disposition.equals(Part.INLINE)) {
          content = part.getContent().toString();
        } else {
          content = part.getContent().toString();
        }
      }
    }
    content;
  }


  def toJson = {
    var list = List[String]()
    for (message <- messages) {
      list = list ::: List(message.toJson)
    }
    list.mkString("[", ",", "]")
  }

  def toDate = {
    var list = List[String]()
    for (message <- messages) {
      list = list ::: List(message.toDate)
    }
    var set=list.sortBy(e => e).toSet
    set.mkString("[", ",", "]")
  }

}