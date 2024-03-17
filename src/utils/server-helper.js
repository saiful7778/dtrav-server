export default async function serverHelper(inputFunc, res) {
  try {
    await inputFunc();
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Server error" });
  }
}
