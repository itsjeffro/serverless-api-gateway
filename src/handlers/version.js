module.exports.versionOne = async (event) => {
  const body = {
    message: "You're viewing version 1."
  };

  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
}
