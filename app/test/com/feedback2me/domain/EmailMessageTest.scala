package com.feedback2me.domain

import org.scalatest.Spec
import org.scalatest.matchers.ShouldMatchers
import org.joda.time.DateTime

class EmailMessageTest extends Spec with ShouldMatchers {
  describe("parse the emails to json") {
    it("should parse to json with timestamp") {
      val expectedMessage = """{"id":"1009818061001","author":{"name":"khu@thoughtwork.com"},"title":{"text":"Pay attention to your careless"},"text":{"text":"jar"},"created_at":"1009814400"}"""
      val mail: EmailMessage = new EmailMessage("khu@thoughtwork.com", "sbwu@thoughtworks.com",
        "Pay attention to your careless", "jar", new DateTime(2002, 1, 1, 1, 1, 1, 1));
      mail.toJson should be === expectedMessage
    }
  }
}