package com.feedback2me.domain;

import org.junit.Assert;
import org.junit.Test;

public class JAllEmailMessageTest {
    @Test
    public void shouldParseToJsonWithTimestamp() {
      EmailMessages message = AllEmailMessages.lookUp("does not exist");
      Assert.assertEquals(0, message.messages().length());
    }
}
