Microdata generator
===

Generate an html markup from an entity (js object).
Update a DOM element with current state of an entity.


Install
---

```npm install --save github.com/ivanrave/microdata-generator```


Usage
---

```
var gen = require('microdataGenerator');

/**
 * @param {Object} elemRow A DOM element (container) for an entity
 * @param {String[]} entityPathLevels Base levels for an entity
 *        eg: second membership in a group: [group, memberships, 2]
 *        no path levels for a root element only.
 * @param {String} entitySchema Schema.org itemtype, like 'Person'
 * @param {Object} entity An object in computed-state format
 *        https://github.com/ivanRave/computed-state
 *        like 'student', 'person', 'thing', 'membership'
 * @param {Object} typeCheckers Validators for all property types
 * @param {Boolean} isGlobalDisplayOnly Read mode (no write mode)
 * @returns {Object} Fulfilled DOM element for this entity
 */
 var updatedContainer = gen(...);
```