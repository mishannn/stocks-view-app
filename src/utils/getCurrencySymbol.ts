export default function (currency: string): string {
  const currencySymbols: any = {
    USD: "$",
    RUB: "₽",
  };

  const symbol = currencySymbols[currency];
  if (!symbol) {
    return currency;
  }

  return symbol;
}
