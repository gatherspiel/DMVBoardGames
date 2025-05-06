export function createState(stateName, states) {
  if (stateName in states) {
    console.warn(`State with name ${stateName} already exists`);
  }
  states[stateName] = {
    data: {},
    subscribers: [],
  };
}

export function subscribeToState(stateName, item, states) {
  if (!(stateName in states)) {
    createState(stateName, states);
  }

  if (!states[stateName].subscribers.includes(item)) {
    states[stateName].subscribers.push(item);
  }
}

export function updateState(stateName, updateFunction, states, data) {
  if (!(stateName in states)) {
    createState(stateName);
  }

  if (!data) {
    data = states[stateName].data;
  }

  states[stateName].data = {
    ...updateFunction(data),
  };

  states[stateName].subscribers.forEach(function (component) {
    component.updateData(states[stateName].data);
  });
}
