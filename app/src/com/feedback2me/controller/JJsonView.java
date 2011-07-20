package com.feedback2me.controller;

import org.springframework.web.servlet.View;
import java.io.IOException;
import java.util.Map;
import java.lang.String;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.PrintWriter;
/**
 * Created by IntelliJ IDEA.
 * User: twer
 * Date: 7/19/11
 * Time: 12:00 AM
 * To change this template use File | Settings | File Templates.
 */
public class JJsonView implements View{
    public String json;

    public JJsonView(String json) {
        this.json = json;
    }

    public String getContentType() {
        return "application/json; charset=UTF-8";
    }

    public void render(Map<String, ?> model, HttpServletRequest reqest, HttpServletResponse response) throws Exception{
      //setContentType("text/html; charset=UTF-8"); response.setCharacterEncoding("UTF-8 ");
      response.setContentType("application/json; charset=UTF-8");
      response.setCharacterEncoding("UTF-8");
        try{
          PrintWriter printWriter = response.getWriter();
          printWriter.write(this.json);
          printWriter.flush();
          printWriter.close();
        }catch (IOException ex){
            ex.printStackTrace();
        }
    }
}
