package com.feedback2me.service

import org.springframework.stereotype.Service
import javax.mail.Message
import com.feedback2me.domain.AllEmailMessages
import java.util.TimerTask

@Service
class FeedbackCollectionService extends TimerTask {
  @Override
  def run {
    val fetcher = new IMAPMailFetcher(AllEmailMessages.GMAIL_ADDRESS, "f33dback.r3cord3r")
    try {
      fetcher.connect()
      AllEmailMessages.reset(fetcher.fetchEmailsFromFolder("INBOX"))
    } catch {
      case e: Exception => {
        e.printStackTrace
        new Array[Message](0)
      }
    } finally {
      fetcher.disconnect
    }
  }
}