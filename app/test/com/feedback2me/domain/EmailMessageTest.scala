package com.feedback2me.domain

import org.scalatest.Spec
import org.scalatest.matchers.ShouldMatchers
import org.joda.time.DateTime

class EmailMessageTest extends Spec with ShouldMatchers {
  describe("parse the email to json") {
    it("should parse to json with timestamp") {
      val expectedMessage = """{
      "id": "1009818061001",
      "title": "Pay attention to your careless",
      "description": "jar",
      "startdate": "2002-01-01 01:01:01",
      "enddate": "2002-01-01 01:01:01",
      "date_display": "day",
      "importance": 50,
      "icon":"triangle_orange.png"
    }"""
      val mail: EmailMessage = new EmailMessage("khu@thoughtwork.com", "sbwu@thoughtworks.com",
        "Pay attention to your careless", "jar", new DateTime(2002, 1, 1, 1, 1, 1, 1));
      mail.toJson should be === expectedMessage
    }
  }
}