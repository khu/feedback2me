package com.feedback2me.domain;

import org.joda.time.DateTime;

public class JEmailMessagesTest {
    public void shouldReturnInMemoryDBInstanceWhenResetWithMails() {
        EmailMessage expectedMessage;
        EmailMessage emailMessage = new EmailMessage("khu@thoughtwork.com", "sbwu@thoughtworks.com",
        "Pay attention to your careless", "jar", new DateTime(2002, 1, 1, 1, 1, 1, 1));

    }
}