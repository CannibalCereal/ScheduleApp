// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require moment
//= require popper
//= require bootstrap
//= require rails-ujs
//= require activestorage
//= require turbolinks
//= require_tree .

$(document).ready(function() {
  $('#homepageCalendar').fullCalendar({
    header: { left: 'prev,today,next',
              center: 'title',
              right: 'agendaWeek,month'
            },
    editable: false, // Don't allow editing of events
    handleWindowResize: true

  })
});

$(function() {
  $('#createEventCalendar').fullCalendar({
    header: { left: 'prev,today,next',
              center: 'title',
              right: 'agendaWeek,month'
            },
    handleWindowResize: true,
    defaultView: 'agendaWeek',
    selectable: true,
    select: function (start, end, jsEvent, view) {
      $("#createEventCalendar").fullCalendar('addEventSource', [{
        start: start,
        end: end,
        rendering: 'background',
        block: true,
      }, ]);
      $("#calendar").fullCalendar("unselect");
    },
    selectOverlap: function(event) {
      return ! event.block;
    }
  })
});
