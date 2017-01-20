$ = require 'jquery'

do fill = (item = 'The most creative minds in Art 444') ->
  $('.tagline').append "#{item}"
fill
