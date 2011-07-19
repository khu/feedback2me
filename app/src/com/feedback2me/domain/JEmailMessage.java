package com.feedback2me.domain;

import org.joda.time.DateTime;
import org.json.simple.JSONValue;
import java.util.HashMap;

public class JEmailMessage {
    String from;
    String to;
    String subject;
    String content;
    DateTime receivedDate;

    JEmailMessage(String from,
                  String to,
                  String subject,
                  String content,
                  DateTime receivedDate) {
        this.from=from;
        this.to=to;
        this.subject=subject;
        this.content=content;
        this.receivedDate=receivedDate;
    }
    public String toJson(){
        //TODO:format this
        HashMap<String, Object> values = new HashMap<String, Object>();
        HashMap<String, String> title = new HashMap<String, String>();
        HashMap<String, String> author = new HashMap<String, String>();
        HashMap<String, String> text = new HashMap<String, String>();
        text.put("text",content);
        author.put("name",from);
        title.put("text",subject);
        values.put("id",String.valueOf(receivedDate.getMillis()));
        values.put("created_at",this.toDate());
        values.put("text",text);
        values.put("author",author);
        values.put("title",title);
        return JSONValue.toJSONString(values);
    }

    String toDate(){
        return String.valueOf(receivedDate.getMillis() / 1000 - receivedDate.getSecondOfDay());
    }
}
