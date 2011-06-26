package com.feedback2me.domain

import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat

class EmailMessage(val from:String,
                   val to:String,
                   val subject:String,
                   val content:String,
                   val receivedDate:DateTime) {
  //1995-12-04 12:00:00
  def toJson = {
    String.format("""{
      "id": "%s",
      "title": "%s",
      "description": "%s",
      "startdate": "%s",
      "enddate": "%s",
      "date_display": "day",
      "importance": 50,
      "icon":"triangle_orange.png"
    }""", receivedDate.getMillis.toString, subject, content,
        receivedDate.toString(DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss")),
        receivedDate.toString(DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss")))
  }
}