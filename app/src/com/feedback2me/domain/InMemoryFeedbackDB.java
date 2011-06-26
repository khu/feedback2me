package com.feedback2me.domain;

import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

public class InMemoryFeedbackDB {
    private Hashtable<Address, List<Message>> feedbackDB;
    private static InMemoryFeedbackDB instance;

    private InMemoryFeedbackDB() {
        feedbackDB = new Hashtable<Address, List<Message>>();
    }

    public static InMemoryFeedbackDB getInstance() {
        if (instance == null) {
            instance = new InMemoryFeedbackDB();
        }
        return instance;
    }

    public void resetWith(Message[] mails) throws MessagingException {
        clearDB();
        for(Message mail : mails){
            insertIntoDB(mail);
        }
    }

    private void clearDB() {
        feedbackDB.clear();
    }

    private void insertIntoDB(Message mail) throws MessagingException {
        Address receiver = getFeedbackReceiver(mail.getAllRecipients());
        if (!feedbackDB.containsKey(receiver)){
            feedbackDB.put(receiver, new ArrayList<Message>());
        }

        List<Message> messages = feedbackDB.get(receiver);
        messages.add(mail);
    }

    private Address getFeedbackReceiver(Address[] addresses) {
        Address receiver = null;

        for(int i=0; i<addresses.length; i++){
            Address address = addresses[i];
            if(!address.equals("feedback.recorder@gmail.com")) {
                receiver = address;
                break;
            }
        }
        return receiver;
    }
}
