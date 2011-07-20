package com.feedback2me.service;
import com.feedback2me.JLogHelper;
import org.springframework.mail.MailException;

import javax.mail.*;
import java.io.IOException;
import java.util.Properties;
import java.util.logging.Logger;

public class JIMAPMailFetcher extends JMailFetcher {
    String username = "";
    String password = "";

    public JIMAPMailFetcher(String username, String password) {
        this.username = username;
        this.password = password;
    }

    Session session = null;
    Store store = null;
    Folder folder = null;
    Logger logger = JLogHelper.getLogger(this);
    @Override
    void connect() {
        Properties props = System.getProperties();
        props.setProperty("mail.store.protocol", "imaps");
        session = Session.getDefaultInstance(props, null);
        try{
            store = session.getStore("imaps");
            store.connect("imap.gmail.com", username, password);
            logger.info("connected through IMAP");
        }catch (NoSuchProviderException ex){
            logger.info("NoSuchProvider");
        } catch (MessagingException e) {
            e.printStackTrace();  //TODO: To change body of catch statement use File | Settings | File Templates.
        }
    }

    @Override
    Message [] fetchEmailsFromFolder(String folderName) {
        Message [] messages=new Message [0];
        try{
            folder = store.getFolder(folderName);
            folder.open(Folder.READ_ONLY);

            int count = folder.getMessageCount();
            logger.info("totally " + count + " messages are available.");

            messages = folder.getMessages();

            FetchProfile fp = new FetchProfile();
            fp.add(FetchProfile.Item.ENVELOPE);
            fp.add(FetchProfile.Item.CONTENT_INFO);
            folder.fetch(messages, fp);
            logger.info(messages.length + " messages has been downloadd.");
        } catch (MessagingException msgex){
            logger.info("Can't Fetch from "+folderName+" :\n");
            msgex.printStackTrace();
        }
        return messages;
    }

    @Override
    void disconnect() {
        try{
            folder.close(false);
            store.close();
        }catch (MessagingException msgex){
            msgex.printStackTrace();
        }
    }
}
