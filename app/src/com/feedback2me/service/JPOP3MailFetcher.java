package com.feedback2me.service;

import com.feedback2me.JLogHelper;

import javax.mail.*;
import java.security.Security;
import java.util.Properties;
import java.util.logging.Logger;

public class JPOP3MailFetcher extends JMailFetcher{
    String username = "";
    String password = "";

    Session session = null;
    Store store = null;
    Folder folder = null;
    Logger logger = JLogHelper.getLogger(this);

    public JPOP3MailFetcher(String username, String password) {
        this.username = username;
        this.password = password;
    }

    @Override
    void connect() {
        logger.info("started to login into Gmail.");
        Security.addProvider(new com.sun.security.sasl.Provider());

        String SSL_FACTORY = "javax.net.ssl.SSLSocketFactory";
        Properties pop3Props = new Properties();

        pop3Props.setProperty("mail.pop3.socketFactory.class", SSL_FACTORY);
        pop3Props.setProperty("mail.pop3.socketFactory.fallback", "false");
        pop3Props.setProperty("mail.pop3.port", "995");
        pop3Props.setProperty("mail.pop3.socketFactory.port", "995");

        session = Session.getInstance(pop3Props, null);

        try{
            store = session.getStore("pop3");
            store.connect("pop.gmail.com", 995, username, password);
            logger.info("logged in");
        }catch (MessagingException msgex){
            logger.info("logged failed");

        }
    }

    @Override
    Message[] fetchEmailsFromFolder(String folderName) {
        Message [] messages=null;
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
            logger.info(messages.length + "messages has been downloadd.");
        } catch (MessagingException msgex){

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
