export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const CLEAR_CART = 'CLEAR_CART';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};
