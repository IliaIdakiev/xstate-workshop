"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.props = props;
exports.createEvent = createEvent;
function props() {
    return {};
}
function createEvent(type, eventProps) {
    const creator = (payload) => ({
        type,
        payload,
    });
    creator.type = type;
    return creator;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NyZWF0ZS1ldmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNCQUVDO0FBRUQsa0NBWUM7QUFoQkQsU0FBZ0IsS0FBSztJQUNuQixPQUFPLEVBQU8sQ0FBQztBQUNqQixDQUFDO0FBRUQsU0FBZ0IsV0FBVyxDQUl6QixJQUFPLEVBQUUsVUFBYztJQUN2QixNQUFNLE9BQU8sR0FBRyxDQUFDLE9BQTBCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDL0MsSUFBSTtRQUNKLE9BQU87S0FDUixDQUFDLENBQUM7SUFFSCxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNwQixPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDIn0=