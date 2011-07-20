package com.feedback2me.service;

import com.feedback2me.domain.JAllEmailMessages;
import org.springframework.stereotype.Service;

import javax.mail.Message;
import java.util.TimerTask;

@Service
public class JFeedbackCollectionService extends TimerTask {
  @Override
  public void run() {
    JIMAPMailFetcher fetcher = new JIMAPMailFetcher(JAllEmailMessages.GMAIL_ADDRESS, "f33dback.r3cord3r");
    try {
      fetcher.connect();
      new JAllEmailMessages().reset(fetcher.fetchEmailsFromFolder("INBOX"));
    } catch(Exception e) {
        e.printStackTrace();
//        new Message[0];
//        new Array[Message](0);
    } finally {
      fetcher.disconnect();
    }
  }
}
