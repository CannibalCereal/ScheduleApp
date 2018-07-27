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
//= require_tree .

$(document).ready(function() {
  $('#homepageCalendar').fullCalendar({
    header: { left: 'prev,today,next',
    center: 'title',
    right: 'agendaWeek,month' },
  editable: false, // Don't allow editing of events
  handleWindowResize: true
})
});

$(function() {
  $('#eventCreateForm').submit(function (event) {
    console.log("FORM SUBMITTED");
    let a = [];
    $("#createEventCalendar").fullCalendar('getEventSources').forEach(function(e) {
      let res = new Object();
      res.start = e.eventDefs[0].dateProfile.start.format();
      res.end = e.eventDefs[0].dateProfile.end.format();
      a.push(res);
    });
    $.ajax({
      type: 'POST',
      url: '/eventcal',
      data: {'arr': JSON.stringify(a)},
      success: function(data){
        //data is whatever you RETURN from your controller.
        //an array, string, object...something
      }
    });
    console.log(a);
  });
});

$(function() {
  $('#createEventCalendar').fullCalendar({
    header: { left: 'prev,today,next',
    center: 'title',
    right: 'agendaWeek,month' },
  contentHeight:600,
  eventColor: '#624763',
  handleWindowResize: true,
  defaultView: 'agendaWeek',
  eventDurationEditable: true,
  selectable: true,
  selectOverlap: false,
  select: function (start, end, jsEvent, view) {
    $("#createEventCalendar").fullCalendar('addEventSource', [{
      start: start,
      end: end,
    }, ]);
    $("#createEventCalendar").fullCalendar("unselect");
    // $('#createEventCalendar').fullCalendar('getEventSources').forEach(function(e) {
    //   let res = new Object();
    //   res.start = e.eventDefs[0].dateProfile.start.format();
    //   res.end = e.eventDefs[0].dateProfile.end.format();
    //   this.output.push(res);
    // });
    // $('#hostAvailability').val(JSON.stringify(out));
  },
  //eventClick: function (event, jsEvent, view) {
  //  $('#createEventCalendar').fullCalendar('removeEvents', event._id);
  //},
  /*eventRender: function(event, element) {
  element.find(".fc-bg").css("pointer-events","none");
  element.append("<span id='btnDeleteEvent'>X</span>" );
  element.find("#btnDeleteEvent").click(function(){
  $('#createEventCalendar').fullCalendar('removeEvents',event._id);
});
},*/
  eventMouseover:function(event,domEvent,view){
    var el=$(this);
    var layer='<div id="events-layer" class="fc-transparent"><span id="delbut'+event.id+'" style="width:10%;" class="btn btn-default trash btn-xs">X</span></div>';
    el.append(layer);
    el.find(".fc-bg").css("pointer-events","none");

    $("#delbut"+event.id).click(function(){
      $('#createEventCalendar').fullCalendar('removeEvents', event._id);
    });
  },
  eventMouseout:function(event){ $("#events-layer").remove(); },
});
});

$(document).on('click','.aGroup', function(){
  var theID = '#card-' + $(this).attr('id');
  if ($(theID).is(":hidden")){
    $(theID).slideDown("fast");
    $(theID).addClass("hideLater");
  } else {
    $(theID).slideUp("fast");
    $(theID).removeClass("hideLater");
  }
});
//OBJECTIVE: when you click outside of a card, hide the active card
//TO DO: When a card is active and you click a different group, hide the active card\
//Compare the card id to the group id
$(function() {
  $('body').on('click.hideCards', function (e) {
    let cardToHide = $('.card.hideLater');
    if (cardToHide && cardToHide.attr('id')) {
      if ($(e.target).attr('id') !== cardToHide.attr('id').charAt(cardToHide.attr('id').length - 1)){
        if(!$(e.target).hasClass('hideLater'))
        {
          let cardID = '#' + cardToHide.attr('id');
          $(cardID).hide();
          $(cardID).removeClass('hideLater');
        }
      }
    }
  });
});
