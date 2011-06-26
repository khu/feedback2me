package com.wallofshame.controller

import org.springframework.stereotype.Controller
import org.springframework.web.servlet.ModelAndView
import org.springframework.web.bind.annotation.{ModelAttribute, PathVariable, RequestMethod, RequestMapping}

@Controller
class FeedbackController {
  @RequestMapping(value = Array("/{email}.html"), method = Array(RequestMethod.GET))
  def index(@PathVariable email: String) = {
    new ModelAndView("index")
  }

  @RequestMapping(value = Array("/{email}.json"), method = Array(RequestMethod.GET))
  def timeline(@PathVariable country: String) = {
    val json = """[
  {
    "id": "jshist",
    "title": "A little history of JavaScript",
    "focus_date": "2001-01-01 12:00:00",
    "initial_zoom": "43",
    "events": [
    {
      "id": "jshist-01",
      "title": "Mocha - Live Script",
      "description": "JavaScript was originally developed by Brendan Eich of
	              Netscape under the name Mocha. LiveScript was the official name for the
	              language when it first shipped in beta releases of Netscape Navigator 2.0
	              in September 1995",
      "startdate": "1995-04-01 12:00:00",
      "enddate": "1995-04-01 12:00:00",
      "date_display": "month",
      "link": "http://en.wikipedia.org/wiki/JavaScript",
      "importance": 40,
      "icon":"square_blue.png"
     },
     {
      "id": "jshist-02",
      "title": "JavaScript is Born",
      "description": "LiveScript is Renamed JavaScript in a joint
	              announcement with Netscape and Sun Microsystems",
      "startdate": "1995-12-04 12:00:00",
      "enddate": "1995-12-04",
      "date_display": "day",
      "link": "http: //en.wikipedia.org/wiki/JavaScript",
      "importance": 50,
      "icon":"triangle_orange.png"
    }
  ]
  }
]"""
    new JsonView(json)
  }
}