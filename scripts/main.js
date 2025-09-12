
*/Header Menu interaction*/
import {click } from "../scripts/funtion-header.js";
click()


 */ Starts teh aplication when the DOM is loading */
import { initializeCards } from './cards.js';
document.addEventListener('DOMContentLoaded', () => {
  initializeCards();
});

