package com.feedback2me.domain

import org.joda.time.DateTime
import collection.JavaConversions
import org.json.simple.JSONValue
import java.util.HashMap

class EmailMessage(val from: String,
                   val to: String,
                   val subject: String,
                   val content: String,
                   val receivedDate: DateTime) {
  def toJson = {
    //TODO:format this
    val values = new HashMap[String,Object]()
    val title = new HashMap[String,String]()
    val author = new HashMap[String,String]()
    val text = new HashMap[String,String]()
    text.put("text",content)
    author.put("name",from)
    title.put("text",subject)
    values.put("id",receivedDate.getMillis.toString)
    values.put("created_at",this.toDate)
    values.put("text",text)
    values.put("author",author)
    values.put("title",title)
    val jsonText = JSONValue.toJSONString(values)
//    var values="{\"id\": \"" + receivedDate.getMillis.toString + "\",\"title\" : {\"text\" : \"" + subject + "\"}, \"user_id\" : \"" + to + "\", \"author\" : {\"name\":\"" + from + "\"}, \"text\" : {\"text\":\"" + content + "\"}, \"created_at\" : " + this.toDate + " }";
//    val jsonText = values.replaceAll("\n","").replaceAll("\r","");
    jsonText
  }

  def toDate = {
    val dateText = (receivedDate.getMillis / 1000 - receivedDate.getSecondOfDay).toString
    dateText
  }

  override def toString = {
    toJson
  }
}