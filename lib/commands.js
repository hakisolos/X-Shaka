const commands = [];
function haki({ command, category, desc, execute }) {
    const commandData = { command, category, desc, execute };
    commands.push(commandData);
}

module.exports = {
    commands,
    haki
};
