module.exports.list = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify([]),
  };
}
