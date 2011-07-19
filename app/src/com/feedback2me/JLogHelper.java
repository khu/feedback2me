package com.feedback2me;

import java.util.logging.Logger;

public class JLogHelper {
  String loggerName = this.getClass().getName();
  public Logger logger = Logger.getLogger(loggerName);
    private JLogHelper(){
        super();
    }
    public static Logger getLogger(){
        return new JLogHelper().logger;
    }
}
