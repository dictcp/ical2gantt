angular.module("app", [
  'gantt',
  'gantt.tooltips',
  'gantt.bounds',
  'gantt.progress',
  'gantt.table',
  'gantt.tree',
  'gantt.groups',
  'gantt.resizeSensor'
])

.controller("MainCtrl", function($scope) {
  // monday through friday
  $scope.options = {
    fromDate: moment(new Date('01/04/2016')),
    toDate: moment(new Date('01/04/2016')).add(4, 'days'),
    headersFormats: {
      'year': 'YYYY', 
      'quarter': '[Q]Q YYYY', 
      month: 'MMMM YYYY', 
      week: 'w', 
      day: 'D', 
      hour: 'h', 
      minute:'HH:mm'
    },
    timeFrames: {
      busy: {
        start: moment('8:00', 'HH:mm'),
        end: moment('21:00', 'HH:mm'),
        working: true,
        default: true
      },
      sleep: {
        color: 'green',
        working: false,
        default: true
      }
    }
  }
  $.get('calendar.ics', function(data){
    $scope.$apply(function() {
      $scope.data = iCalToGantt(data)
    })
  })
})

function iCalToGantt(rawData) {
  var data = ICAL.parse(rawData)
  var vevents = _.filter(data[2], i=>i[0] === 'vevent');
  vevents = _.map(vevents, i=>i[1]);
  return _.reduce(vevents, (acc, vevent) => {
    var name = vevent.find( i => i[0] === "summary" )[3];
    var from = moment(vevent.find( i => i[0] === "dtstart" )[3]);
    var to = moment(vevent.find( i => i[0] === "dtend" )[3]);
    var location = vevent.find( i => i[0] === "location" )[3];
    var recur = vevent.find( i => i[0] === "rrule" );
    var tasks = Task.buildAll(name+" @ "+location, from, to, recur ? recur[3] : null);
    acc.push({ name: name, tasks: tasks })
    return acc;
  }, [])
}
