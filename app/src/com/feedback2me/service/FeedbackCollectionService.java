package com.feedback2me.service;

import com.feedback2me.domain.InMemoryFeedbackDB;
import org.springframework.stereotype.Service;

import javax.mail.Message;
import java.util.TimerTask;

@Service
public class FeedbackCollectionService extends TimerTask{
    @Override
    public void run() {
        GmailUtils gmail = new GmailUtils();

        try {
            gmail.connect("feedback.recorder@gmail.com", "f33dback.r3cord3r");
            Message[] messages = gmail.fetchEmailsFromFolder("INBOX");
            InMemoryFeedbackDB.getInstance().resetWith(messages);
            gmail.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
