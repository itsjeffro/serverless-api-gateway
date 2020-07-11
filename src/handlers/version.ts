module.exports.versionOne = async (event: any) => {
  const body = {
    environment: process.env.STAGE || '',
    message: `You're viewing version 1`,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
}
