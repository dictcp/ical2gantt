Util = {}
Task = {}

Days = {
  MO:1,
  TU:2,
  WE:3,
  TH:4,
  FR:5,
  SA:6,
  SU:0
}

Task.build = (name, from, to) => {
  return {name: name, from: from, to: to}
}

Task.buildAll = (name, from, to, recur) => {
  var tasks = [];
  var task = Task.build(name, from, to)

  if (recur && _.isArray(recur.byday)) {
    _.each(recur.byday, day => {
      var day = Days[day]
      tasks.push(Task.build(name, moment(from).day(day), moment(to).day(day)))
    })
  } else {
    tasks.push(task);
  }

  if (recur && recur.freq === 'WEEKLY') {
    var until = recur.until;
    // repeat until rule.until
  }
  return tasks;
}
