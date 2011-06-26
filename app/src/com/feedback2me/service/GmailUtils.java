package com.feedback2me.service;

import javax.mail.*;
import java.security.Security;
import java.util.Properties;

/**
 * 用於收取Gmail郵件
 */
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

//    public static void dumpPart(Part p) throws Exception {
//        if (p instanceof Message)
//            dumpEnvelope((Message) p);
//
//        String ct = p.getContentType();
//        try {
//            pr("CONTENT-TYPE: " + (new ContentType(ct)).toString());
//        } catch (ParseException pex) {
//            pr("BAD CONTENT-TYPE: " + ct);
//        }
//
//        /*
//         * Using isMimeType to determine the content type avoids
//         * fetching the actual content data until we need it.
//         */
//        if (p.isMimeType("text/plain")) {
//            pr("This is plain text");
//            pr("---------------------------");
//            System.out.println((String) p.getContent());
//        } else {
//            // just a separator
//            pr("---------------------------");
//
//        }
//    }

//    public static void dumpEnvelope(Message m) throws Exception {
//        pr(" ");
//        Address[] a;
//        // FROM
//        if ((a = m.getFrom()) != null) {
//            for (int j = 0; j < a.length; j++)
//                pr("FROM: " + a[j].toString());
//        }
//
//        // TO
//        if ((a = m.getRecipients(Message.RecipientType.TO)) != null) {
//            for (int j = 0; j < a.length; j++) {
//                pr("TO: " + a[j].toString());
//            }
//        }
//
//        // SUBJECT
//        pr("SUBJECT: " + m.getSubject());
//
//        // DATE
//        Date d = m.getSentDate();
//        pr("SendDate: " +
//                (d != null ? d.toString() : "UNKNOWN"));
//
//
//    }

//    public static void pr(String s) {
//        System.out.println(s);
//    }

}