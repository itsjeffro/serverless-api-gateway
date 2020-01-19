module.exports = {

  default: process.env.SECRETS_DRIVER || 'aws',

  drivers: {

    aws: {

      region: "ap-southeast-2",

    },

    config: {

      //

    }

  }

};