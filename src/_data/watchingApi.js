export default function () {
  return {
    url: String(process.env.WATCHING_API_URL || '').trim()
  };
}
