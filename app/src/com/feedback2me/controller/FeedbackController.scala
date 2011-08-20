package com.feedback2me.controller

import org.springframework.stereotype.Controller
import org.springframework.web.servlet.ModelAndView
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import com.feedback2me.domain.AllEmailMessages
import java.util.HashMap
import org.springframework.web.bind.annotation._

@Controller
class FeedbackController {
  @RequestMapping(value = Array("/index.html"), method = Array(RequestMethod.GET))
  def index(@RequestParam("email") email:String) = {
    val data: HashMap[String, String] = new HashMap()
    data.put("email", email)
    new ModelAndView("index", data)
  }

  @RequestMapping(value = Array("/{email}.json"), method = Array(RequestMethod.GET))
  def timeline(@PathVariable email: String) = {
    val focusDate: String = new DateTime().minusWeeks(1).toString(DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss"))
    val events = AllEmailMessages.lookUp(email).toJson
    //TODO: format this
    val jsonTemplate = """{"memos":%s}"""
    new JsonView(String.format(jsonTemplate, events))
  }
  @RequestMapping(value = Array("/{email}.date"), method = Array(RequestMethod.GET))
  def timerange(@PathVariable email: String) = {
    val today: String = new DateTime().minusWeeks(1).toString(DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss"))
    val events = AllEmailMessages.lookUp(email).toDate
    //TODO: format this
    val jsonTemplate = """%s"""
    new JsonView(String.format(jsonTemplate, events))
  }
}