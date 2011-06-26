package com.feedback2me

import domain.{EmailMessages, EmailMessage}
import org.scalatest.Spec
import org.scalatest.matchers.ShouldMatchers
import org.joda.time.DateTime

class EmailMessagesTest extends Spec with ShouldMatchers {
  describe("parse the emails to json") {
    it("should parse to json with timestamp") {
      val expectedMessage = """[{
      "id": "1009818061001",
      "title": "Pay attention to your careless",
      "description": "jar",
      "startdate": "2002-01-01 01:01:01",
      "enddate": "2002-01-01 01:01:01",
      "date_display": "day",
      "importance": 50,
      "icon":"triangle_orange.png"
    },{
      "id": "1012586522002",
      "title": "I love your code",
      "description": "I like it",
      "startdate": "2002-02-02 02:02:02",
      "enddate": "2002-02-02 02:02:02",
      "date_display": "day",
      "importance": 50,
      "icon":"triangle_orange.png"
    }]"""
      val mail1: EmailMessage = new EmailMessage("khu@thoughtwork.com", "sbwu@thoughtworks.com",
        "Pay attention to your careless", "jar", new DateTime(2002, 1, 1, 1, 1, 1, 1));
      val mail2: EmailMessage = new EmailMessage("jp@thoughtwork.com", "sbwu@thoughtworks.com",
        "I love your code", "I like it", new DateTime(2002, 2, 2, 2, 2, 2, 2));
      val emailMessages: EmailMessages = new EmailMessages()
      emailMessages.add(mail1)
      emailMessages.add(mail2)
      emailMessages.toJson should be === expectedMessage
    }
  }
}