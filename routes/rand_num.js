var rand_num = function (min, max) {
    var randomNumber = Math.floor(Math.random() * (1 + max - min) + min);
    randomNumber = randomNumber.toString();
    return randomNumber;
};

module.exports = rand_num;