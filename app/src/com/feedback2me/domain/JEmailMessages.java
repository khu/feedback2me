package com.feedback2me.domain;

import com.feedback2me.JLogHelper;
import org.joda.time.DateTime;

import javax.mail.*;
import java.io.IOException;
import java.util.*;
import java.util.logging.Logger;

public class JEmailMessages{

    Logger logger = JLogHelper.getLogger(this);
    ArrayList<JEmailMessage> messages =new ArrayList<JEmailMessage>();

    public JEmailMessages add(Message mail) throws IOException,MessagingException{
        String content = readContent(mail);
        JEmailMessage emailMessage = new JEmailMessage(String.valueOf(mail.getFrom()[0]),
                String.valueOf(mail.getRecipients(Message.RecipientType.TO)[0]),
                mail.getSubject(),
                content,
                new DateTime(mail.getReceivedDate()));
        this.logger.info("mail " + emailMessage);
        messages.add(emailMessage);
        JEmailMessages emailMessages = new JEmailMessages();
        emailMessages.messages = messages;
        return emailMessages;
    }

    public String readContent(Message mail) throws MessagingException,IOException {
        String content = "";
        if (mail.isMimeType("text/plain")) {
            content = mail.getContent().toString();
        } else {
            Multipart mp = (Multipart)mail.getContent();
            int mpCount = mp.getCount();
            for (int i=0;i<mpCount;i++) {
                BodyPart part = mp.getBodyPart(i);
                String disposition = part.getDisposition();
                if (disposition != null && disposition.equals(Part.INLINE)) {
                    content = part.getContent().toString();
                } else {
                    content = part.getContent().toString();
                }
            }
        }
        return content;
    }


    public String toJson() {
        ArrayList<String> list =new ArrayList<String>();
        for (JEmailMessage message : messages.toArray(new JEmailMessage [messages.size()])) {
            list.add(message.toJson());
        }
        String [] retarr=new String[list.size()];
        list.toArray(retarr);
        String retval="[";
        for(String s :retarr){
            retval+=s;
        }
        return mkString(list, "[", ",", "]");
    }

    public String toDate() {
        List<String> list =new ArrayList<String>();
        for (JEmailMessage message : messages.toArray(new JEmailMessage [messages.size()])) {
            list.add(message.toDate());
//        list = list ::: List(message.toDate)
        }
        HashSet set=new HashSet(list);
        return mkString(set,"[", ",", "]");
    }
    public String mkString(Collection<?extends Object> co,
                           String header, String separator, String footer) {
        String delim = "";
        StringBuilder sb = new StringBuilder(header);

        for (Iterator<?extends Object> it = co.iterator(); it.hasNext(); ) {
            sb.append(delim).append("" + it.next());
            delim = separator;
        }

        return sb.append(footer).toString();
    }

}
