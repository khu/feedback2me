package com.feedback2me.service;

import com.feedback2me.domain.InMemoryFeedbackDB;

import javax.mail.Message;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimerTask;

public class FeedbackCollectionService extends TimerTask{
    @Override
    public void run() {
        Message[] messages = fetchEmails();

        InMemoryFeedbackDB.getInstance().resetWith(messages);

        String logMsg = createLogMsg(messages.length);
        writeLog(logMsg);
    }

    private Message[] fetchEmails() {
        GmailUtils gmail = new GmailUtils();

        try {
            gmail.connect(InMemoryFeedbackDB.GMAIL_ADDRESS, "f33dback.r3cord3r");
            Message[] messages = gmail.fetchEmailsFromFolder("INBOX");
            gmail.disconnect();

            return messages;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private void writeLog(String logMsg) {
        try {
            FileWriter fileWriter = new FileWriter(new File("out/log/fetch_email.log"), true);
            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
            bufferedWriter.append(logMsg);
            bufferedWriter.newLine();
            bufferedWriter.close();
            fileWriter.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String createLogMsg(int messageCount) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String datetime = dateFormat.format(new Date());

        return String.format("fetched %d emails from %s at %s.",
                            messageCount, InMemoryFeedbackDB.GMAIL_ADDRESS, datetime);
    }
}
