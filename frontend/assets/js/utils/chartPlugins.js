export const customTicks = {
    id: 'customTicks',
    beforeDraw(chart, args, options) {
        const {scales: {y: {ctx, ticks, height, width}}} = chart;
        const itemHeight = height / ticks.length;

        ctx.save();
        ctx.strokeStyle = options.borderColor;

        ticks.forEach((item, ind) => {
            const textWidth = calculateTextWidth(item.label.toUpperCase(), options.font).width;

            ctx.beginPath();
            ctx.setLineDash(options.borderDash || []);
            ctx.moveTo(textWidth, itemHeight*(ind + 1));
            ctx.lineTo(width, itemHeight*(ind + 1));
            ctx.stroke();
        });

        ctx.restore();
    },
};

function calculateTextWidth(text, font) {
    const canvas = document?.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = font;

    return ctx.measureText(text);
}
