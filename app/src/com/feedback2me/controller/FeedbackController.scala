package com.feedback2me.controller

import org.springframework.stereotype.Controller
import org.springframework.web.servlet.ModelAndView
import org.springframework.web.bind.annotation.{ModelAttribute, PathVariable, RequestMethod, RequestMapping}
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat

@Controller
class FeedbackController {
  @RequestMapping(value = Array("/{email}.html"), method = Array(RequestMethod.GET))
  def index(@PathVariable email: String) = {
    new ModelAndView("index")
  }

  @RequestMapping(value = Array("/{email}.json"), method = Array(RequestMethod.GET))
  def timeline(@PathVariable email: String) = {
    val focusDate: String = new DateTime().minusWeeks(1).toString(DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss"))
    //AllEmailMesssage.lookup(email).toJson
    val dummyJson = """[{
      "id": "1009818061001",
      "title": "Pay attention to your careless",
      "description": "jar",
      "startdate": "2011-06-26 01:01:01",
      "enddate": "2011-06-26 01:01:01",
      "date_display": "day",
      "importance": 50,
      "icon":"triangle_orange.png"
    },{
      "id": "1012586522002",
      "title": "I love your code",
      "description": "I like it",
      "startdate": "2011-06-22 02:02:02",
      "enddate": "2011-06-22 02:02:02",
      "date_display": "day",
      "importance": 50,
      "icon":"triangle_orange.png"
    }]"""
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
    new JsonView(String.format(jsonTemplate, focusDate, dummyJson))
  }
}