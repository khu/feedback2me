package com.wallofshame.controller

import org.springframework.stereotype.Controller
import org.springframework.web.servlet.ModelAndView
import org.springframework.web.bind.annotation.{ModelAttribute, PathVariable, RequestMethod, RequestMapping}

@Controller
class ShameController {
  @RequestMapping(value = Array("/{country}.html"), method = Array(RequestMethod.GET))
  def index(@PathVariable country: String) = {
     new ModelAndView("index")
  }
}