package com.feedback2me.controller

import org.springframework.web.servlet.View
import java.util.Map
import java.lang.String
import javax.servlet.http.{HttpServletResponse, HttpServletRequest}
import java.io.PrintWriter

class JsonView(val json:String) extends View {
  
  @Override
  def render(model: Map[String, _], reqest: HttpServletRequest, response: HttpServletResponse) {
    //setContentType("text/html; charset=UTF-8"); response.setCharacterEncoding("UTF-8 ");
    response.setCharacterEncoding("UTF-8")
    val printWriter: PrintWriter = response.getWriter
    printWriter.write(this.json);
    printWriter.flush
    printWriter.close
  }

  @Override
  def getContentType = {"text/x-json; charset=UTF-8"}

}