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

//Homepage calendar display
$(document).ready(function() {
  $('#homepageCalendar').fullCalendar({
    header: {
      left: 'prev,today,next',
      center: 'title',
      right: 'agendaWeek,month'
    },
  editable: false, // Don't allow editing of events
  handleWindowResize: true
});
});

//On creating a new event, posts the calendar's entries as the host's availabilities
$(function() {
  $('#eventCreateForm').submit(function (event) {
    let a = [];
    $("#createEventCalendar").fullCalendar('getEventSources').forEach(function(e) {
      let res = new Object();
      res.start = e.eventDefs[0].dateProfile.start.format();
      res.end = e.eventDefs[0].dateProfile.end.format();
      a.push(res);
    });
    if(a.length === 0) {
      alert("You must provide availabilities for your guests.\n Please try again.");
      return false;
    }
    $.ajax({
      type: 'POST',
      url: '/eventcal',
      data: {'arr': JSON.stringify(a)}
    });
  });
});

//Event Creation calendar display
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
  },
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

//TODO when finalized events happen, display all finalized events for the groups selected.
$(document).on('click', '.homeGroups', function() {
  var clickedID = $(this).attr('id');
});

//GROUP PAGE FUNCTIONALITY: Display group card when group name is clicked. Don't show multiple cards, stupidass
$(document).on('click','.aGroup', function(e){
  let groupID = $(e.target).attr('id').split('-')[1];
  let theID = '#card-' + groupID;
  let currentCard = $('.card.hideLater');
  //If a card is currently showing
  if(currentCard && currentCard.attr('id')) {
    //If the group you clicked matches the opened card
    let cardIDNum = $(currentCard).attr('id').split('-')[1];
    if(groupID === cardIDNum) {
      $(theID).slideUp("fast");
      $(theID).removeClass("hideLater");
      return;
    }
    //If you clicked a group NOT matching opened card
    else {
      $(currentCard).hide();
      $(currentCard).removeClass('hideLater');
    }
  }
  $(theID).slideDown("fast");
  $(theID).addClass("hideLater");
});

$(function() {
  $(document).on('click', '.addMember', function(e) {
    let parentCard = $(e.target).parents('.card')[0];
    let idToPass = $(parentCard).attr('id').split('-')[1];
    $.ajax({
      type: 'POST',
      url: '/group/new_member',
      data: {'group': idToPass}
    });
    $("#inviteModal").modal('show');
  });
});


//Invidivual Event Page's Calendar
$(function () {
  $('#individualEventCal').fullCalendar({
    header: { left: 'prev,next',
    center: 'title',
    right: 'agendaWeek,listMonth' },
    defaultView: 'listMonth',
    contentHeight:600,
    eventColor: '#624763',
    handleWindowResize: true,
    defaultView: 'agendaWeek',
    eventDurationEditable: true,
    selectable: true,
    selectOverlap: function(event) {
      return event.rendering === 'background';
    },
    select: function (start, end, jsEvent, view) {
      if(isValidEvent(start, end)) {
        $("#individualEventCal").fullCalendar('addEventSource', [{
          start: start,
          end: end,
        }, ]);
      }
      $("#individualEventCal").fullCalendar("unselect");
    },
    eventMouseover:function(event,domEvent,view){
      var el=$(this);
      if(event.rendering === 'background') {
        return;
      }
      var layer='<div id="events-layer" class="fc-transparent"><span id="delbut'+event.id+'" style="width:10%;" class="btn btn-default trash btn-xs">X</span></div>';
      el.append(layer);
      el.find(".fc-bg").css("pointer-events","none");

      $("#delbut"+event.id).click(function(){
        $('#individualEventCal').fullCalendar('removeEvents', event._id);
      });
    },
    eventMouseout:function(event){ $("#events-layer").remove(); },
  });
});

$(function() {
  $('#userAvailButton').click(function(e) {
    let a = [];
    $("#individualEventCal").fullCalendar('getEventSources').forEach(function(e) {
      let res = new Object();
      res.start = e.eventDefs[0].dateProfile.start.format();
      res.end = e.eventDefs[0].dateProfile.end.format();
      a.push(res);
    });
    if(a.length === 0) {
      alert("You must provide availabilities for this event.\n Please try again.");
      return false;
    }
    $.ajax({
      type: 'POST',
      url: '/userAvail',
      data: {'avails': JSON.stringify(a)}
    });
  });
});

$(function() {
  if(!$('#individualEventCal').length > 0) {
    return;
  }
  $.ajax({
    type: 'GET',
    url: '/hostAvails',
    dataType: "json",
    success: function(data) {
      let arr = [];
      let earliest = moment().add(1, 'y');
      data.forEach(function(e) {
        let newEvent = {
          title: e.id.toString(),
          start: e.start,
          end: e.end,
          rendering: 'background'
        };
        console.log(newEvent);
        arr.push(newEvent);
        earliest = moment.min(earliest, moment(newEvent.start));
      });
      $('#individualEventCal').fullCalendar('renderEvents', arr, true);
      $('#individualEventCal').fullCalendar('gotoDate', earliest);
    }
  });
});

var isValidEvent = function(start,end) {
    return $("#individualEventCal").fullCalendar('clientEvents', function (event) {
        return (event.rendering === "background" && //Add more conditions here if you only want to check against certain events
                (start.isAfter(event.start) || start.isSame(event.start,'minute')) &&
                (end.isBefore(event.end) || end.isSame(event.end,'minute')) );
    }).length > 0;
};
