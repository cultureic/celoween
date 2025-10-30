export function openTransak() {
  const apiKey = process.env.NEXT_PUBLIC_TRANSAK_API_KEY;
  const url = `https://global.transak.com/?apiKey=${apiKey ?? ''}&cryptoCurrencyCode=CELO&network=CELO`;
  window.open(url, 'transak', 'width=420,height=720');
}



