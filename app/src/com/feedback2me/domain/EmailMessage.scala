package com.feedback2me.domain

import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import org.json.simple.JSONValue
import collection.JavaConversions
import org.json.simple.parser.JSONParser

class EmailMessage(val from: String,
                   val to: String,
                   val subject: String,
                   val content: String,
                   val receivedDate: DateTime) {
  def toJson = {
    var values = Map[String, String]();
    values += ("id" -> receivedDate.getMillis.toString,
      "title" -> subject,
      "to" -> to,
      "from" -> from,
      "description" -> content,
      "startdate" -> receivedDate.toString(DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss")),
      "enddate" -> receivedDate.toString(DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss")),
      "date_display" -> "day",
      "importance" -> "50",
      "icon" -> "triangle_orange.png")
    val jsonText = JSONValue.toJSONString(JavaConversions.asJavaMap(values))
    jsonText
  }

  override def toString = {
    toJson
  }
}