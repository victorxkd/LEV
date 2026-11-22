export function hasEnoughStock(stock: number, quantity: number): boolean {
  return quantity >= 1 && quantity <= stock;
}