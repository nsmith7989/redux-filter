const random = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};

const size = () => {
    return random(['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large']);
};

const color = () => {
    return random(['Red', 'Green', 'Blue', 'Orange', 'Yellow']);
};

const designer = () => {
    return random([
        'Ralph Lauren',
        'Alexander Wang',
        'Grayse',
        'Marc NY Performance',
        'Scrapbook',
        'J Brand Ready to Wear',
        'Vintage Havana',
        'Neiman Marcus Cashmere Collection',
        'Derek Lam 10 Crosby'
    ]);
};

const type = () => {
    return random([
        'Cashmere',
        'Cardigans',
        'Crew and Scoop',
        'V-Neck',
        'Cowl & Turtleneck'
    ]);
};

const price = () => {
    return (Math.random() * 100).toFixed(2);
};

const data = [];
for(let i = 0; i < 300; i++) {
    const currentColor = color();
    const currentSize = size();
    const currentType = type();
    const currentDesigner = designer();
    const currentPrice = price();

    data.push({
        title: `${currentDesigner} ${currentType} ${currentColor} ${currentSize}`,
        color: currentColor,
        size: currentSize,
        designer: currentDesigner,
        type: currentType,
        price: currentPrice,
        salesPrice: currentPrice * .8
    });
}

export default data;
