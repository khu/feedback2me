package com.feedback2me.domain

import org.joda.time.DateTime

class EmailMessage(val from:String,
                   val to:String,
                   val subject:String,
                   val content:String,
                   val receivedDate:DateTime) {
  def toJson = {
    """{
      "id": "jshist-02",
      "title": "JavaScript is Born",
      "description": "LiveScript is Renamed JavaScript in a joint
	              announcement with Netscape and Sun Microsystems",
      "startdate": "1995-12-04 12:00:00",
      "enddate": "1995-12-04",
      "date_display": "day",
      "link": "http: //en.wikipedia.org/wiki/JavaScript",
      "importance": 50,
      "icon":"triangle_orange.png"
    }"""
  }
}