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
      left: 'month',
      center: 'title',
      right: 'prev,today,next'
    },
    editable: false, // Don't allow editing of events
    handleWindowResize: true,
    defaultView: 'month',
    events: function(start, end, timezone, callback) {
      let arr = [];
      $.ajax({
        type: 'GET',
        url: '/getHomepage',
        dataType: "json",
        success: function(data) {
          data.forEach(function(x) {
            x.events.forEach(function(y) {
              let newEvent = {
                title: y.title,
                start: y.start,
                id: y.eventid,
                url: ('events/final/' + y.eventid)
              };
              arr.push(newEvent);
            });
          });
          callback(arr);
        }
      });
    },
    dayClick: function(date, jsEvent, view) {
      if(view.name !== 'month') {
        return;
      }
      $('#homepageCalendar').fullCalendar('changeView', 'agendaWeek');
      $('#homepageCalendar').fullCalendar('gotoDate', date);
    },
    eventClick: function(event, jsEvent, view) {
      $.ajax({
        type: 'POST',
        url: '/goToEvent',
        data: {'eventTitle': event.title},
      });
    }
  });
});

$(document).on('click', '.homeGroups', function(e) {
  let targetID = $(e.target).attr('id').split('homeGroup')[1];
  let arr = [];
  $.ajax({
    type: 'GET',
    url: '/getHomepage',
    dataType: "json",
    success: function(data) {
      data.forEach(function(i) {
        if(targetID === 'All' || targetID === i.id.toString()) {
          i.events.forEach(function(j) {
            let newEvent = {
              title: j.title,
              start: j.start,
              id: j.eventid,
              url: ('events/final/' + j.eventid)
            };
            arr.push(newEvent);
          });
        }
      });
      $('#homepageCalendar').fullCalendar('removeEvents');
      $('#homepageCalendar').fullCalendar('renderEvents', arr);
    }
  });
});

//On creating a new event, posts the calendar's entries as the host's availabilities
$(function() {
  $('#eventCreateForm').submit(function (event) {
    let a = [];
    $("#createEventCalendar").fullCalendar('clientEvents').forEach(function(e) {
      let res = new Object();
      res.start = e.start.format();
      res.end = e.end.format();
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
              right: 'month' },
  contentHeight:600,
  eventColor: '#624763',
  handleWindowResize: true,
  defaultView: 'month',
  eventDurationEditable: true,
  selectable: true,
  selectOverlap: false,
  dayClick: function(date, jsEvent, view) {
    if(view.name !== 'month') {
      return;
    }
    $('#createEventCalendar').fullCalendar('changeView', 'agendaWeek');
    $('#createEventCalendar').fullCalendar('gotoDate', date);
  },
  select: function (start, end, jsEvent, view) {
    if(view.name === 'month') {
      return;
    }
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
    header: {
    left: 'month',
    center: 'title',
    right: 'prev,next',
    },
    defaultView: 'month',
    contentHeight:600,
    eventColor: '#624763',
    handleWindowResize: true,
    eventDurationEditable: true,
    selectable: true,
    events: [],
    viewRender: function (view, element) {
      $('#individualEventCal').fullCalendar('removeEvents');
      eventCal('#individualEventCal', view.name);
    },
    dayClick: function(date, jsEvent, view) {
      if(view.name !== 'month') {
        return;
      }
      $('#individualEventCal').fullCalendar('changeView', 'agendaWeek');
      $('#individualEventCal').fullCalendar('gotoDate', date);
    },
    eventResize: function(event, delta, revertFunc) {
      if (!isValidEvent('#individualEventCal', event.start, event.end)){
        revertFunc();
      };
    },
    selectOverlap: function(event) {
      return event.rendering === 'background';
    },
    select: function (start, end, jsEvent, view) {
      if(isValidEvent('#individualEventCal', start, end)) {
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


var eventCal = function(cal, view){
  if (!$(cal).length) {
    return;
  }
  let arr = [];

  if (view === 'month') {
    $.ajax({
      type: 'GET',
      url: '/getAvails',
      dataType: "json",
      success: function(data) {
        data.avails.forEach(function(e) {
          let newEvent = {
            title: e.id.toString(),
            start: getDay(e.start),
            end: getDay(e.end) === getDay(e.start) ? moment(getDay(e.end)).add(1, 'd').format() : getDay(e.end),
            rendering: 'background',
            allDay: true
          };
          arr.push(newEvent);
        });
        data.oldAvails.forEach(function(e) {
          let oldEvent = {
            title: e.id.toString(),
            start: getDay(e.start),
            end: getDay(e.end) === getDay(e.start) ? moment(getDay(e.end)).add(1, 'd').format() : getDay(e.end),
            allDay: true
          };
          arr.push(oldEvent);
        });
        // arr.forEach(x => $('#individualEventCal').fullCalendar('renderEvent', x));
        $(cal).fullCalendar('renderEvents', arr);
      }
    });
  }
  else {
    $.ajax({
      type: 'GET',
      url: '/getAvails',
      dataType: "json",
      success: function(data) {
        data.avails.forEach(function(e) {
          let newEvent = {
            title: e.id.toString(),
            start: e.start,
            end: e.end,
            rendering: 'background'
          };
          arr.push(newEvent);
        });
        data.oldAvails.forEach(function(e) {
          let oldEvent = {
            title: e.id.toString(),
            start: e.start,
            end: e.end
          };
          arr.push(oldEvent);
        });
        // arr.forEach(x => $('#individualEventCal').fullCalendar('renderEvent', x));
        $(cal).fullCalendar('renderEvents', arr);
      }
    });
  }
};

var getDay = function(e) {
  return e.split('T')[0];
}

$(function () {
  $('#hostViewCal').fullCalendar({
    header: {
    left: 'month',
    center: 'title',
    right: 'prev,next',
    },
    contentHeight:600,
    eventColor: '#624763',
    handleWindowResize: true,
    defaultView: 'month',
    selectable: true,
    viewRender: function (view, element) {
      $('#hostViewCal').fullCalendar('removeEvents');
      eventCal('#hostViewCal', view.name);
    },
    dayClick: function(date, jsEvent, view) {
      if(view.name !== 'month') {
        return;
      }
      $('#hostViewCal').fullCalendar('changeView', 'agendaWeek');
      $('#hostViewCal').fullCalendar('gotoDate', date);
    },
    selectOverlap: function(event) {
      return event.rendering === 'background';
    },
    select: function (start, end, jsEvent, view) {
      if(isValidEvent('#hostViewCal', start, end)) {
        $('#hostViewCal').fullCalendar('removeEvents', function(e) {
          return e.rendering !== 'background';
        });
        $("#hostViewCal").fullCalendar('addEventSource', [{
          start: start,
          end: end,
        }, ]);
      }
      $("#hostViewCal").fullCalendar("unselect");
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
        $('#hostViewCal').fullCalendar('removeEvents', event._id);
      });
    },
    eventMouseout:function(event){ $("#events-layer").remove(); },
  });
});


//Click handler for user availability submit button
$(function() {
  $('#userAvailButton').click(function(e) {
    let a = [];
    $("#individualEventCal").fullCalendar('clientEvents').forEach(function(e) {
      if (e.rendering === 'background') {
        return;
      }
      let res = new Object();
      res.start = e.start.format();
      res.end = e.end.format();
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

  $('#hostFinalizeButton').click(function(click) {
    let a = $("#hostViewCal").fullCalendar('clientEvents').filter(function(e) {
      return e.rendering !== 'background';
    });
    if(a.length !== 1) {
      alert("You must select a time to finalize this event.\n Please try again.");
      return false;
    }
    let startTime = a[0].start.format();
    $.ajax({
      type: 'POST',
      url: '/hostFinal',
      data: {'time': startTime}
    });
  });
});


$(document).on("click", '.aHostAvail', function(e){
  availDate = $(e.target).attr('id');
  $('#individualEventCal').fullCalendar('gotoDate', availDate);

});
var isValidEvent = function(cal, start,end) {
    return $(cal).fullCalendar('clientEvents', function (event) {
        return (event.rendering === "background" && $(cal).fullCalendar('getView').name !== 'month' &&//Add more conditions here
                (start.isAfter(event.start) || start.isSame(event.start,'minute')) &&
                (end.isBefore(event.end) || end.isSame(event.end,'minute')) );
    }).length > 0;
};
