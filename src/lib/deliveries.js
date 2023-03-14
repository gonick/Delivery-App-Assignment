import {
  menuItems,
  restaurants,
  companies,
  deliveryTimes,
  addresses,
} from "./seed-data";
import { randomInteger, sample } from "./utils";
import moment from "moment-timezone";

/**
 * @typedef Delivery
 * @type {object}
 * @property {string} id ID of the delivery
 * @property {string} client name of the client
 * @property {string} restaurant name of the restaurant
 * @property {string} pickupAt Pickup date & time of the delivery in ISO8601
 * @property {string} deliverAt Delivery date & time of the delivery in ISO8601
 * @property {string} state State the delivery is in
 * @property {string} pickupAdddress Pickup address of delivery
 * @property {string} deliveryAddress Delivery address of delivery
 * @property {OrderItems[]} orderItems Set of order items to pick up in the delivery
 * @property {string} timeZone Timezone the delivery is in
 */

/**
 * @typedef OrderItem
 * @type {object}
 * @property {string} id ID of the order item
 * @property {number} qty Quantity of order items
 * @property {string} description Description of the order item
 * @property {number} price Price in cents ($1 = 100 cents)
 */

/**
 * Enum for delivery object state values.
 * @readonly
 * @enum {string}
 */
export const DeliveryStates = Object.freeze({
  SCHEDULED: "scheduled",
  DRIVER_CONFIRMED: "driver_confirmed",
  DRIVER_AT_RESTAURANT: "driver_at_restaurant",
  PICKED_UP: "picked_up",
  DRIVER_AT_CLIENT: "driver_at_client",
  DELIVERED: "delivered",
});

const states = [
  DeliveryStates.SCHEDULED,
  DeliveryStates.DRIVER_CONFIRMED,
  DeliveryStates.DRIVER_AT_RESTAURANT,
  DeliveryStates.PICKED_UP,
  DeliveryStates.DRIVER_AT_CLIENT,
  DeliveryStates.DELIVERED,
];

export const actionButtonTextMapping = {
  [DeliveryStates.SCHEDULED]: "Accept",
  [DeliveryStates.DRIVER_CONFIRMED]: "Reached Restaurant",
  [DeliveryStates.DRIVER_AT_RESTAURANT]: "Complete Pickup",
  [DeliveryStates.PICKED_UP]: "Reached Destination",
  [DeliveryStates.DRIVER_AT_CLIENT]: "Mark as Delivered",
  [DeliveryStates.DELIVERED]: "Delivered",
};

const TZ = "America/Vancouver";

let nextIdForDelivery = 1;
let nextIdForOrderItem = 1;

/**
 * Generates a random order item
 * returns {OrderItem}
 */
function generateOrderItem() {
  const orderItem = {
    id: nextIdForOrderItem,
    qty: randomInteger(1, 3),
    description: sample(menuItems),
    price: randomInteger(200, 2500),
  };
  nextIdForOrderItem++;
  return orderItem;
}

/**
 * Returns a set (2 to 7) of random order items
 * @returns {OrderItem[]}
 */
function generateOrderItems() {
  const orderItems = new Array(randomInteger(2, 7)).fill(null);
  return orderItems.map((_) => generateOrderItem());
}

/**
 * Generates a random delivery object with a set of random order items for a given dayDate string
 * @param {string} dayDate Day date in YYYY-MM-DD format to generate delivery for
 * @returns {Delivery}
 */
function generateDelivery(dayDate) {
  const deliverAt = moment.tz(`${dayDate}T${sample(deliveryTimes)}:00`, TZ);

  const pickupAddress = sample(addresses);
  const deliveryAddress = sample(addresses.filter((_) => (_) => pickupAddress));

  const delivery = {
    id: nextIdForDelivery,
    client: sample(companies),
    restaurant: sample(restaurants),
    state: "scheduled",
    deliverAt: deliverAt.format(),
    pickupAt: deliverAt.subtract(15, "minutes").format(),
    pickupAddress,
    deliveryAddress,
    orderItems: generateOrderItems(),
    timeZone: TZ,
  };
  nextIdForDelivery++;
  return delivery;
}

/**
 * Generates an random set (between 2 and 7) of delivery objects.
 * @param {string} dayDate A day date string in the format of YYYY-MM-DD to generate the delivery on
 * returns {Delivery[]}
 */
function generateDeliveries(dayDate) {
  const deliveries = new Array(randomInteger(2, 7)).fill(null);
  return deliveries.map((_) => generateDelivery(dayDate));
}

/**
 * Stores a set of delivery objects
 * @param {string} dayString A day date string in the format of YYYY-MM-DD to generate the deliveries on
 * @param {Delivery[]} deliveries A set of delivery objects to be stored
 * @returns {Promise}
 */
export function storeDeliveries(dayString, deliveries) {
  localStorage.setItem(dayString, JSON.stringify(deliveries));
}

/**
 * Fetch deliveries for a given day string
 * @param {string} dayString A day date string in format of YYYY-MM-DD as the key used to fetch the deliveries
 * @returns {Delivery[]}
 */
export function fetchDeliveries(dayString) {
  const storedDeliveries = localStorage.getItem(dayString);
  if (!storedDeliveries) {
    const deliveries = generateDeliveries(dayString);
    storeDeliveries(dayString, deliveries);
    return deliveries;
  } else {
    return JSON.parse(storedDeliveries);
  }
}

/**
 * returns the next state for the delivery
 * @param {string} currentState
 * @returns {string}
 */
export function getNextState(currentState) {
  const index = states.indexOf(currentState);
  if (index === -1 || index === states.length - 1)
    throw new Error("Invalid State");
  return states[index + 1];
}

/**
 * sorts the deliveries in asscending as per the following order: pickups - dropoffs - completed.
 * @param {Delivery[]} deliveries
 * @returns {Delivery[]}
 */
export function sortDeliveries(deliveries) {
  let { pickups, dropoffs, completed } = deliveries.reduce(
    function (acc, item) {
      switch (item.state) {
        case DeliveryStates.SCHEDULED:
        case DeliveryStates.DRIVER_CONFIRMED:
        case DeliveryStates.DRIVER_AT_RESTAURANT:
          acc.pickups.push(item);
          break;
        case DeliveryStates.PICKED_UP:
        case DeliveryStates.DRIVER_AT_CLIENT:
          acc.dropoffs.push(item);
          break;
        case DeliveryStates.DELIVERED:
          acc.completed.push(item);
          break;
        default:
          break;
      }
      return acc;
    },
    { pickups: [], dropoffs: [], completed: [] }
  );

  pickups = pickups.sort((a, b) => moment(a.pickupAt).diff(moment(b.pickupAt)));
  dropoffs = dropoffs.sort((a, b) =>
    moment(a.deliverAt).diff(moment(b.deliverAt))
  );
  return [].concat(pickups, dropoffs, completed);
}
