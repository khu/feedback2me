package com.feedback2me.controller;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.Assert;

import javax.swing.*;

/**
 * Created by IntelliJ IDEA.
 * User: twer
 * Date: 7/19/11
 * Time: 12:10 AM
 * To change this template use File | Settings | File Templates.
 */
public class JJsonViewTest {
    private JJsonView jv;

    @Before
    public void setUp() throws Exception {
        jv=new JJsonView("");
    }

    @After
    public void tearDown() throws Exception {

    }

    @Test
    public void testGetContentTypeShouldReturnString() throws Exception {
        Assert.assertEquals(jv.getContentType(),"application/json; charset=UTF-8");
    }

    @Test
    public void testRender() throws Exception {

    }
}
