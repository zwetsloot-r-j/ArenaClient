export default function({dispatch, getState}) {

  return next => action => {

    let startTime = Date.now();

    let result = next(action);

    let time = Date.now() - startTime;
    if (time <= 5) {
      //console.log(`handled action ${action.type} in ${time}`);
    } else if (time <= 25) {
      console.warn(`handled action ${action.type} in ${time}`);
    } else {
      console.error(`handled action ${action.type} in ${time}`);
    }

    return result;

  }

}
