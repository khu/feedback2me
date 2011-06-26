package com.feedback2me

import domain.EmailMessage
import org.scalatest.Spec
import org.scalatest.matchers.ShouldMatchers
import org.joda.time.DateTime

class EmailMessageTest extends Spec with ShouldMatchers {
  describe("parse the email to json") {
    it("should parse to json with timestamp") {
      val expectedMessage = """{
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
      val mail: EmailMessage = new EmailMessage("khu@thoughtwork.com", "sbwu@thoughtworks.com",
        "Pay attention to your careless", "jar", new DateTime(2002, 1, 1, 1, 1, 1, 1));
      mail.toJson should be === expectedMessage
    }
  }
}