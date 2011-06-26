package com.feedback2me.domain;

import org.joda.time.DateTime;

import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import java.util.Hashtable;

public class InMemoryFeedbackDB {
    private Hashtable<String, EmailMessages> feedbackDB;
    private static InMemoryFeedbackDB instance;
    public static final String GMAIL_ADDRESS = "feedback.recorder@gmail.com";

    private InMemoryFeedbackDB() {
        feedbackDB = new Hashtable<String, EmailMessages>();
    }

    public static InMemoryFeedbackDB getInstance() {
        if (instance == null) {
            instance = new InMemoryFeedbackDB();
        }
        return instance;
    }

    public void resetWith(Message[] mails){
        clearDB();
        for(Message mail : mails){
            try {
                insertIntoDB(mail);
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        }
    }

    private void clearDB() {
        feedbackDB.clear();
    }

    private void insertIntoDB(Message mail) throws MessagingException {
        String receiver = getFeedbackReceiver(mail.getAllRecipients());
        if (!feedbackDB.containsKey(receiver)){
            feedbackDB.put(receiver, new EmailMessages());
        }

        EmailMessages messages = feedbackDB.get(receiver);
        messages.add(createEmailMessage(receiver, mail));
    }

    private EmailMessage createEmailMessage(String receiver, Message mail){
        try {
            return new EmailMessage(mail.getFrom()[0].toString(),
                    receiver,
                    mail.getSubject().toString(),
                    mail.getContent().toString(),
                    new DateTime(mail.getReceivedDate()));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String getFeedbackReceiver(Address[] addresses) {
        String receiver = null;

        for(int i=0; i<addresses.length; i++){
            Address address = addresses[i];
            if(!address.equals(GMAIL_ADDRESS)) {
                receiver = address.toString();
                break;
            }
        }
        return receiver;
    }
}
