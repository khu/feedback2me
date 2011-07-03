package com.feedback2me.domain

import org.scalatest.Spec
import org.scalatest.matchers.ShouldMatchers

class AllEmailMessagesTest extends Spec with ShouldMatchers {
  describe("parse the emails to json") {
    it("should parse to json with timestamp") {
      val message: EmailMessages = AllEmailMessages.lookUp("does not exist")
      message.messages.length should be === 0
    }
  }
}