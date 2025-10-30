export function openOnramper() {
  const apiKey = process.env.NEXT_PUBLIC_ONRAMPER_API_KEY;
  const url = `https://buy.onramper.com/?apiKey=${apiKey ?? ''}&defaultCrypto=CELO&onlyCryptos=CELO`;
  window.open(url, 'onramper', 'width=420,height=720');
}



