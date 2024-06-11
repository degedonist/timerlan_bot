const coinFlipper = (choice) => {
    const bot_choice = Math.floor(Math.random() * 2);
    let player_choice = 0;
    if (choice === 'Орёл') {
        player_choice = 0;
    } else {
        player_choice = 1;
    };

    return bot_choice === player_choice;
};

module.exports = { coinFlipper };