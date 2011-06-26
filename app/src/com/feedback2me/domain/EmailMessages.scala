package com.feedback2me.domain


class EmailMessages {
  var messages: List[EmailMessage] = List[EmailMessage]()

  def add(mail: EmailMessage) {
    messages = messages ::: List(mail)
  }

  def toJson = {
    var list = List[String]()
    for (message <- messages) {
      list = list ::: List(message.toJson)
    }
    list.mkString("[", ",", "]")
  }
}