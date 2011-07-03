package com.feedback2me.controller

import org.springframework.stereotype.Controller
import org.springframework.web.servlet.ModelAndView
import org.springframework.web.bind.annotation.{ModelAttribute, PathVariable, RequestMethod, RequestMapping}
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import com.feedback2me.domain.AllEmailMessages
import java.util.HashMap

@Controller
class FeedbackController {
  @RequestMapping(value = Array("/{email}.html"), method = Array(RequestMethod.GET))
  def index(@PathVariable email: String) = {
    val data: HashMap[String, String] = new HashMap()
    data.put("email", email)
    new ModelAndView("index", data)
  }

  @RequestMapping(value = Array("/{email}.json"), method = Array(RequestMethod.GET))
  def timeline(@PathVariable email: String) = {
    val focusDate: String = new DateTime().minusWeeks(1).toString(DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss"))
    val events = AllEmailMessages.lookUp(email).toJson
    val jsonTemplate = """[
  {
    "id": "feedback",
    "title": "The feedback for you",
    "focus_date": "%s",
    "initial_zoom": "48",
	  "color": "#82530d",
    "events": %s
  }
  ]
"""
    new JsonView(String.format(jsonTemplate, focusDate, events))
  }
}