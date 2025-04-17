const states = {};

export function createState(stateName) {
  if (stateName in states) {
    console.warn(`State with name ${stateName} already exists`);
  }
  states[stateName] = {
    data: {},
    subscribers: [],
  };
}

export function createComponentState(stateName, component) {
  createState(stateName);
  subscribeToState(stateName, component);
}

export function subscribeToState(stateName, component) {
  if (!(stateName in states)) {
    createState(stateName);
  }

  if (!states[stateName].subscribers.includes(component)) {
    states[stateName].subscribers.push(component);
  }
}

export function updateState(stateName, updateFunction, data) {
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

export function getState(stateName) {
  return states[stateName].data;
}
