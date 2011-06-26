package com.feedback2me.service;

import javax.mail.*;
import java.security.Security;
import java.util.Properties;

public class GmailUtils {

    private Session session = null;
    private Store store = null;
    private Folder folder;

    public void connect(String username, String password) throws Exception {
        Security.addProvider(new com.sun.security.sasl.Provider());

        String SSL_FACTORY = "javax.net.ssl.SSLSocketFactory";

        Properties pop3Props = new Properties();

        pop3Props.setProperty("mail.pop3.socketFactory.class", SSL_FACTORY);
        pop3Props.setProperty("mail.pop3.socketFactory.fallback", "false");
        pop3Props.setProperty("mail.pop3.port", "995");
        pop3Props.setProperty("mail.pop3.socketFactory.port", "995");

        session = Session.getInstance(pop3Props, null);
        store = session.getStore("pop3");
        store.connect("pop.gmail.com", 995, username, password);
    }

    public Message[] fetchEmailsFromFolder(String folderName) throws Exception {
        folder = store.getFolder(folderName);
        folder.open(Folder.READ_ONLY);
        Message[] messages = folder.getMessages();

        FetchProfile fp = new FetchProfile();
        fp.add(FetchProfile.Item.ENVELOPE);
        fp.add(FetchProfile.Item.CONTENT_INFO);
        folder.fetch(messages, fp);
        folder.close(false);

        return messages;
    }

    public void disconnect() throws Exception {
        store.close();
    }

}