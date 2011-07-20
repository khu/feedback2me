package com.feedback2me.domain;

import java.io.IOException;
import java.util.HashMap;
import javax.mail.*;
import javax.mail.internet.InternetAddress;

public class JAllEmailMessages {
  public static final String GMAIL_ADDRESS  = "feedback.recorder@gmail.com";
  static HashMap<String, JEmailMessages> emailMessages = new HashMap <String, JEmailMessages>();

  public void reset(Message [] mails) {
    clearDB();
    JEmailMessages messages;
    for (Message mail : mails) {
      try {
         InternetAddress address= (InternetAddress)(mail.getRecipients(Message.RecipientType.TO)[0]);
         String receiver =address.getAddress();
         messages = lookUp(receiver);
         messages.add(mail);
         emailMessages.put(receiver, messages);
      } catch(MessagingException msgex) {
          msgex.printStackTrace();
      } catch (IOException e) {
          e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
      }
    }
  }

  public static JEmailMessages lookUp(String receiver) {
      JEmailMessages retVal;
      if (emailMessages.containsKey(receiver))
        retVal = emailMessages.get(receiver);
      else
        retVal = new JEmailMessages();
      return retVal;
  }

  private void clearDB() {
    emailMessages = new HashMap<String, JEmailMessages>();
  }
}
