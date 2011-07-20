package com.feedback2me;

import java.util.logging.Logger;

public class JLogHelper {
    public static Logger getLogger(Object obj){
        String loggerName = obj.getClass().getName();
        Logger logger = Logger.getLogger(loggerName);
        return logger;
    }

}
