module.exports.handlerItsWorking = (request, reply) => {
  reply("It's working").code(200);
};

module.exports.itsWorking = {
  handler: this.handlerItsWorking,
};
