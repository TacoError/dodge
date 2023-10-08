class ColorModifier {

    constructor(initialColor) {
        this.initialColor = initialColor;
        this.modifierColor = "";
        this.modifierLength = 0;
        this.initialColorHold = initialColor;
    }

    tick() {
        if (this.modifierLength > 0) {
            this.modifierLength--;
        }
    }

    getColor() {
        if (this.modifierLength > 0) {
            return this.modifierColor;
        }
        return this.initialColor;
    }

    setModifier(color, forl) {
        this.modifierColor = color;
        this.modifierLength = forl;
    }

};

module.exports = ColorModifier;