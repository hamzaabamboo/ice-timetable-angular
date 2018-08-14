import syncscroll from "./syncscroll";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from "@angular/material/tree";

export class Timetable {
  scope = {
    hourStart: 9,
    hourEnd: 17
  };
  locations = [];
  events = [];

  setScope(start, end): Timetable {
    if (isValidHourRange(start, end)) {
      this.scope.hourStart = start;
      this.scope.hourEnd = end;
    } else {
      throw new RangeError(
        "Timetable scope should consist of (start, end) in whole hours from 0 to 23"
      );
    }
    return this;
  }
  addLocations(newLocations): Timetable {
    const existingLocations = this.locations;
    if (newLocations instanceof Array) {
      newLocations.forEach(function(loc) {
        if (!locationExistsIn(loc, existingLocations)) {
          existingLocations.push(loc);
        } else {
          throw new Error("Location already exists");
        }
      });
    } else {
      throw new Error("Tried to add locations in wrong format");
    }
    return this;
  }
  addEvent(name, location, start, end, options = null): Timetable {
    if (!locationExistsIn(location, this.locations)) {
      throw new Error("Unknown location");
    }
    if (!isValidTimeRange(start, end)) {
      throw new Error("Invalid time range: " + JSON.stringify([start, end]));
    }

    const optionsHasValidType =
      Object.prototype.toString.call(options) === "[object Object]";

    this.events.push({
      name: name,
      location: location,
      startDate: start,
      endDate: end,
      options: optionsHasValidType ? options : undefined
    });

    return this;
  }
}

export class Renderer {
  timetable: Timetable = null;
  container = null;

  constructor(tt) {
    if (!(tt instanceof Timetable)) {
      throw new Error("Initialize renderer using a Timetable");
    }
    this.timetable = tt;
  }

  draw(selector) {
    const timetable = this.timetable;
    this.container = document.querySelector(selector);
    const container = this.container;

    const checkContainerPrecondition = () => {
      if (this.container === null) {
        throw new Error("Timetable container not found");
      }
    };
    const appendTimetableAside = () => {
      const asideNode = container.appendChild(document.createElement("aside"));
      const asideULNode = asideNode.appendChild(document.createElement("ul"));
      appendRowHeaders(asideULNode);
    };
    const appendRowHeaders = ulNode => {
      for (let k = 0; k < timetable.locations.length; k++) {
        const liNode = ulNode.appendChild(document.createElement("li"));
        const spanNode = liNode.appendChild(document.createElement("span"));
        spanNode.className = "row-heading";
        spanNode.textContent = timetable.locations[k];
      }
    };
    const appendTimetableSection = () => {
      const sectionNode = container.appendChild(
        document.createElement("section")
      );
      const headerNode = appendColumnHeaders(sectionNode);
      const timeNode = sectionNode.appendChild(document.createElement("time"));
      timeNode.className = "syncscroll";
      timeNode.setAttribute("name", "scrollheader");
      const width = headerNode.scrollWidth + "px";
      appendTimeRows(timeNode, width);
    };
    const appendColumnHeaders = node => {
      const headerNode = node.appendChild(document.createElement("header"));
      headerNode.className = "syncscroll";
      headerNode.setAttribute("name", "scrollheader");
      const headerULNode = headerNode.appendChild(document.createElement("ul"));

      let completed = false;
      let looped = false;

      for (let hour = timetable.scope.hourStart; !completed; ) {
        const liNode = headerULNode.appendChild(document.createElement("li"));
        const spanNode = liNode.appendChild(document.createElement("span"));
        spanNode.className = "time-label";
        spanNode.textContent = prettyFormatHour(hour);

        if (
          hour === timetable.scope.hourEnd &&
          (timetable.scope.hourStart !== timetable.scope.hourEnd || looped)
        ) {
          completed = true;
        }
        if (++hour === 24) {
          hour = 0;
          looped = true;
        }
      }
      return headerNode;
    };
    const appendTimeRows = (node, width) => {
      const ulNode = node.appendChild(document.createElement("ul"));
      ulNode.style.width = width;
      ulNode.className = "room-timeline";
      for (let k = 0; k < timetable.locations.length; k++) {
        const liNode = ulNode.appendChild(document.createElement("li"));
        appendLocationEvents(timetable.locations[k], liNode); /**/
      }
    };
    const appendLocationEvents = (location, node) => {
      for (let k = 0; k < timetable.events.length; k++) {
        const event = timetable.events[k];
        if (event.location === location) {
          appendEvent(event, node);
        }
      }
    };
    const appendEvent = (event, node) => {
      const hasOptions = event.options !== undefined;
      let hasURL,
        hasAdditionalClass,
        hasDataAttributes,
        hasClickHandler = false;

      if (hasOptions) {
        hasURL = event.options.url !== undefined;
        hasAdditionalClass = event.options.class !== undefined;
        hasDataAttributes = event.options.data !== undefined;
        hasClickHandler = event.options.onClick !== undefined;
      }

      const elementType = hasURL ? "a" : "span";
      const eventNode = node.appendChild(document.createElement(elementType));
      const smallNode = eventNode.appendChild(document.createElement("small"));
      eventNode.title = event.name;

      if (hasURL) {
        eventNode.href = event.options.url;
      }

      if (hasDataAttributes) {
        for (const key of Object.keys(event.options.data)) {
          eventNode.setAttribute("data-" + key, event.options.data[key]);
        }
      }

      if (hasClickHandler) {
        eventNode.addEventListener("click", function(e) {
          event.options.onClick(event, timetable, e);
        });
      }

      eventNode.className = hasAdditionalClass
        ? "time-entry " + event.options.class
        : "time-entry";
      eventNode.style.width = computeEventBlockWidth(event);
      eventNode.style.left = computeEventBlockOffset(event);
      smallNode.textContent = event.name;
    };
    const computeEventBlockWidth = event => {
      const start = event.startDate;
      const end = event.endDate;
      const durationHours = computeDurationInHours(start, end);
      // return (durationHours / scopeDurationHours) * 100 + "%";
      return durationHours * 96 + "px";
    };
    const computeDurationInHours = (start, end) => {
      return (end.getTime() - start.getTime()) / 1000 / 60 / 60;
    };
    const computeEventBlockOffset = event => {
      const scopeStartHours = timetable.scope.hourStart;
      const eventStartHours =
        event.startDate.getHours() + event.startDate.getMinutes() / 60;
      const hoursBeforeEvent = getDurationHours(
        scopeStartHours,
        eventStartHours
      );
      // return (hoursBeforeEvent / scopeDurationHours) * 100 + "%";
      return hoursBeforeEvent * 96 + "px";
    };

    const scopeDurationHours = getDurationHours(
      timetable.scope.hourStart,
      timetable.scope.hourEnd
    );
    checkContainerPrecondition();
    emptyNode(container);
    appendTimetableAside();
    appendTimetableSection();
    syncscroll.reset();
  }
}

const isValidHourRange = (start, end) => {
  return isValidHour(start) && isValidHour(end);
};
const isValidHour = number => {
  return isInt(number) && isInHourRange(number);
};
const isInt = number => {
  return number === parseInt(number, 10);
};
const isInHourRange = number => {
  return number >= 0 && number < 24;
};
const locationExistsIn = (loc, locs) => {
  return locs.indexOf(loc) !== -1;
};
const isValidTimeRange = (start, end) => {
  const correctTypes = start instanceof Date && end instanceof Date;
  const correctOrder = start < end;
  return correctTypes && correctOrder;
};
const getDurationHours = (startHour, endHour) => {
  return endHour >= startHour ? endHour - startHour : 24 + endHour - startHour;
};
const emptyNode = node => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

const prettyFormatHour = hour => {
  const prefix = hour < 10 ? "0" : "";
  return prefix + hour + ":00";
};
