package com.feedback2me.service;

import org.junit.Test;

public class JFeedbackCollectionServiceTest {
    @Test
    public void shouldReturnInMemoryDBInstanceWhenResetWithMails() {
        JFeedbackCollectionService service = new JFeedbackCollectionService();
        service.run();
    }
}
