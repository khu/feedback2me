package com.feedback2me.domain

import org.scalatest.Spec
import org.scalatest.matchers.ShouldMatchers
import org.joda.time.DateTime
class EmailMessagesTest extends Spec with ShouldMatchers {


  describe("parse the emails to json") {
    it("should not take the replied email into count") {
      val replied: EmailMessage = new EmailMessage("khu@thoughtwork.com", "sbwu@thoughtworks.com",
        "Re: 松哥，强烈的暗示不工作啊", "jar", new DateTime(2002, 1, 1, 1, 1, 1, 1));
      val emailMessages: EmailMessages = new EmailMessages()
      val added: EmailMessages = emailMessages._add(replied)
      
      added.length should be === 0
    }
    
    it("should take the replied email into count") {
      val replied: EmailMessage = new EmailMessage("khu@thoughtwork.com", "sbwu@thoughtworks.com",
        "松哥，强烈的暗示不工作啊", "jar", new DateTime(2002, 1, 1, 1, 1, 1, 1));
      val emailMessages: EmailMessages = new EmailMessages()
      val added: EmailMessages = emailMessages._add(replied)

      added.length should be === 1
    }
  }
}